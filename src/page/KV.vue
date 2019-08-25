<template>
  <div class="kv">
    <div class="breadcrumb">
      <div class="breadcrumb-left">
        <Breadcrumb>
          <BreadcrumbItem v-for="(item, key) in breadcrumb" :key="key">
            <Icon type="ios-home-outline" v-if="key == 0" @click="openByBreadcrumb(-1)"></Icon>
            <span @click="openByBreadcrumb(key)">{{ item || '/' }}</span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div class="btns">
        <Checkbox v-model="showTree" @on-change="onShowTree">{{$t('key.showTree')}}</Checkbox>

        <RadioGroup v-model="listType" type="button" @on-change="changeListType">
          <Radio label="grid">
            <Icon type="md-grid"/>
          </Radio>
          <Radio label="list">
            <Icon type="ios-list-box-outline"/>
          </Radio>
          <Radio label="card">
            <Icon type="ios-card-outline"/>
          </Radio>
        </RadioGroup>
        <Button
          type="success"
          @click="showAddKeyInfoModel"
        >{{$t('public.add')}}</Button>
        <Poptip placement="left-end" confirm :title="$t('key.delConfirm')" @on-ok="delKeys">
          <Button type="error">{{$t('public.multiDelete')}}</Button>
        </Poptip>
      </div>
    </div>
    <div class="key-body" :style="{height:(screenHeight-50)+'px'}">
      <Split v-model="showSplit" min="0px" @on-move-end="moveEndSplit">
        <div slot="left" class="split-left" v-show="showSplit >= 0.03">
          <Tree :data="treeData" :load-data="loadTreeData" @on-select-change="onTree"></Tree>
        </div>
        <div slot="right" class="split-right">
          <div class="grid" v-show="listType == 'grid'">
            <KvGrid ref="grid" v-on:openKey="openKey"></KvGrid>
          </div>
          <div class="list" v-show="listType == 'list'">
            <KvList ref="list" v-on:openKey="openKey"></KvList>
          </div>
          <div class="card" v-show="listType == 'card'">
            <KvCard ref="card" v-on:openKey="openKey"></KvCard>
          </div>
        </div>
      </Split>
    </div>

    <!-- 查看弹框 -->
    <Drawer :width="60" v-model="showKeyInfoModel" :title="$t('key.editKey')">
      <Form :model="showKeyInfo" :label-width="80">
        <FormItem label="Key" prop="key">
          <Input v-model="showKeyInfo.path" disabled placeholder="key"></Input>
        </FormItem>
        <FormItem label="Version" prop="version">
          <Input v-model="showKeyInfo.version" disabled placeholder="Version"></Input>
        </FormItem>
        <FormItem label="Value" prop="value">
          <MonacoEditor
            class="editor"
            height="55vh"
            width="100%"
            :codes="showKeyInfo.value"
            :editorOptions="codeOptions"
            language="json"
            ref="showMonacoEditor"
          ></MonacoEditor>
        </FormItem>
        <FormItem>
          <Button @click="saveKey" type="primary">{{$t('public.save')}}</Button>
          <Button @click="showKeyInfoModel = false" style="margin-left: 8px">{{$t('public.close')}}</Button>
        </FormItem>
      </Form>
    </Drawer>

    <!-- 添加弹框 -->
    <Drawer :transfer="true" :width="60" v-model="addKeyInfoModel" :title="$t('key.addKey')">
      <Form :model="addKeyInfo" :label-width="80">
        <FormItem label="Key" prop="key">
          <Input v-model="addKeyInfo.key" :placeholder="$t('key.keyPlaceholder')">
            <span slot="prepend">{{fullDir}}</span>
          </Input>
        </FormItem>
        <div v-show="addKeyInfoType == 'KEY'">
          <FormItem label="Value" prop="value">
            <MonacoEditor
              class="editor"
              height="55vh"
              width="100%"
              :codes="addKeyInfo.value"
              :editorOptions="codeOptions"
              language="json"
              ref="addMonacoEditor"
            ></MonacoEditor>
          </FormItem>
        </div>


        <FormItem>
          <Button @click="addKey" type="primary">{{$t('public.save')}}</Button>
          <Button @click="addKeyInfoModel = false" style="margin-left: 8px">{{$t('public.close')}}</Button>
        </FormItem>
      </Form>
    </Drawer>
  </div>
</template>

<script>
import KvGrid from "@/components/KvGrid";
import KvList from "@/components/KvList";
import KvCard from "@/components/KvCard";
import { KV } from "@/api/kv.js";
import { bus } from "@/page/bus.js";
import MonacoEditor from "@/components/MonacoEditor"

export default {
  components: {
    KvGrid,
    KvList,
    KvCard,
    MonacoEditor
  },
  data() {
    return {
      breadcrumb: [''], // 面包线
      listType: "grid", // 显示方式
      showSplit: 0.15, // 分隔面板比例
      screenHeight: document.documentElement.clientHeight, // 屏幕高度

      showTree: true, // 是否显示左侧菜单
      treeData: [
        {
          title: "parent",
          loading: false,
          children: [],
          path: "", // 默认前缀
          render: (h, { root, node, data }) => {
            return h(
              "span",
              {
                style: {
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    this.getList(data.path);
                  }
                }
              },
              [
                h("Icon", {
                  props: {
                    type: "ios-home-outline"
                  },
                  style: {
                    marginRight: "3px"
                  }
                }),
                h("span", data.title)
              ]
            );
          }
        }
      ], // 树形

      // 当前展示key的完整路径
      fullDir: "/",

      // 编辑弹框
      showKeyInfoModel: false, // 查看弹框
      showKeyInfo: {}, // 查看key的详细信息

      // 添加编辑
      addKeyInfoModel: false, // 添加弹框
      addKeyInfo: {}, // 添加详细信息
      addKeyInfoType: 'KEY',

      // 代码编辑配置
      codeOptions: {
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: false,
        glyphMargin: true
      },

    };
  },
  mounted() {
    // 获取列表
    this.getList("");
    // 加载是否显示树形
    let showTree = localStorage.getItem('show-tree') || 'true';
    if (showTree == 'true'){
      this.showTree = true;
    }else{
      this.showTree = false;
      this.showSplit = 0;
    }

    // 选择etcd服务事件
    bus.$off("etcd-server-selected");
    bus.$on("etcd-server-selected", item => {
      console.log(item);
      this.getList('');
    });
  },
  methods: {
    // 获取 key 列表
    getList(dir) {
      console.log("getList1", dir);
      if (typeof dir == "undefined") {
        dir = "/"; // todo 需要换成前缀
      }
      if (dir === ''){
        this.fullDir = dir
      }else{
        this.fullDir = dir || this.fullDir;
      }
      console.log("getList2", dir);
      
      if (this.listType == "grid") {
        this.$refs.grid.getList(dir);
      } else if (this.listType == "list") {
        this.$refs.list.getList(dir);
      } else if (this.listType == "card") {
        this.$refs.card.getList(dir);
      }
    },

    // 打开面包线
    openByBreadcrumb(index) {
      index = index || 0;
      let dir = "";
      if (index == -1) {
        dir = '';
        this.breadcrumb = [''];
      } else if (index == 0) {
        dir = this.breadcrumb[0] || "/";
      } else {
        let paths = [];
        for (let i = 0; i <= index; i++) {
          paths.push(this.breadcrumb[i]);
        }
        console.log(paths);
        dir = paths.join("/");
      }

      // console.log(dir);
      this.getList(dir);
    },

    // 获取key详细信息
    openKey(item) {
      console.log(item);
      if (item.is_dir == false) {
        KV.GetKeyInfo(item.path).then(response => {
          this.showKeyInfo = response.data;
          this.showKeyInfoModel = true;
        });
        let self = this;
        window.setTimeout(function () {
          self.$refs.showMonacoEditor.initEditor();
        }, 100)
      } else {
        this.getList(item.path);
      }
    },

    // 批量删除key
    delKeys() {
      let selected = [];
      if (this.listType == "grid") {
        selected = this.$refs.grid.selected;
      } else if (this.listType == "list") {
        selected = this.$refs.list.selected;
      } else if (this.listType == "card") {
        selected = this.$refs.card.selected;
      }
      console.log(selected);
      if (selected.length == 0) {
        this.$Message.warning("请选择要删除的key");
        return;
      }
      selected.forEach((val, index) => {
        KV.DelKey(val.path).then(response => {
        });
      });
      console.log(this.fullDir);
      this.$refs.grid.clearSelected();
      this.getList(this.fullDir);
    },

    // 删除一个值
    delOneKey(dir) {
      if (!dir) {
        return;
      }
      KV.DelKey(dir).then(response => {
        this.getList(this.fullDir);
      });
    },

    // 保存key - 修改操作
    saveKey() {
      let putData = this.showKeyInfo;
      // putData.is_dir = false;
      putData.value = this.$refs.showMonacoEditor.getValue();
      KV.SaveKey(putData).then(response => {
        this.$Message.success(this.$t("key.saveSuccessfully"));
        this.getList(this.fullDir);
        this.showKeyInfoModel = false;
      });
    },

    changeKeyType(val){
      this.addKeyInfo.kType = val;
      this.addKeyInfoType = val;
      // console.log(val);
    },

    // 添加key
    addKey() {
      if (
        this.addKeyInfo.key == "" ||
        typeof this.addKeyInfo.key == "undefined"
      ) {
        this.$Message.warning(this.$t("key.keyNotEmpty"));
        return;
      }
      // console.log(this.addKeyInfo);
      let fullDir = this.fullDir;
      // key 必须以/开头除非父级为空
      if (fullDir != '' && this.HasPrefix(this.addKeyInfo.key, "/") == false){
        this.$Message.warning(this.$t("key.keyNotPrefixBar"));
        return
      }
      // 请求参数
      let postData = {
        path: fullDir + this.addKeyInfo.key,
        // is_dir: this.addKeyInfo.kType == "DIR",
        value: this.$refs.addMonacoEditor.getValue()
      };
      this.addKeyInfo.value = "";
      this.addKeyInfo.key = "";

      KV.AddKey(postData).then(response => {
        this.$Message.success(this.$t("key.addSuccessfully"));
        this.addKeyInfoModel = false;
        this.getList(this.fullDir);
      });
    },

    // 切换展示方式
    changeListType() {
      localStorage.setItem("list_type", this.listType || "grid");

      if (this.listType == "grid") {
      } else if (this.listType == "list") {
        // this.$refs.list.page = 1;
      }
      this.getList(this.fullDir);
    },

    // 左侧树形加载
    loadTreeData(item, callback) {
      // console.log(item)
      KV.GetKeyList(item.path).then(response => {
        response.data = response.data || [];
        let list = [];
        response.data.forEach(val => {
          if (val.is_dir == true) {
            val.title = val.name;
            val.loading = false;
            val.children = [];
            list.push(val);
          }
        });
        callback(list);
        if (list.length == 0) {
          delete item.loading;
          delete item.children;
          console.log(item);
        }
      });
    },

    // 点击树形节点
    onTree(list, item) {
      console.log(item);
      this.getList(item.path);
    },

    // 面板拖动
    moveEndSplit() {
      if (this.showSplit < 0.03) {
        this.showSplit = 0;
        this.showTree = false;
      } else {
        this.showTree = true;
      }
    },

    // 隐藏显示左侧树形菜单
    onShowTree(show) {
      console.log(show);
      this.showTree = show;
      if (show == true) {
        if (this.showSplit < 0.15) {
          this.showSplit = 0.15;
        }
      } else {
        this.showSplit = 0;
      }
    },

    // 显示添加
    showAddKeyInfoModel(){
      this.addKeyInfoModel = true;
      this.addKeyInfo.kType='KEY';
      this.addKeyInfo.value = '';
      let self = this;
      window.setTimeout(function () {
        self.$refs.addMonacoEditor.initEditor();
      }, 100)
      
    }
  },

  // 监听当前路径key
  watch: {
    fullDir(newFullDir) {
      console.log(newFullDir);
      if (newFullDir == '/' || newFullDir == '') {
        this.breadcrumb = [newFullDir];
      } else {
        this.breadcrumb = newFullDir.split("/");
      }
      console.log(this.breadcrumb);
    },
    showTree(newShow){
      localStorage.setItem('show-tree', newShow);
    }
  }
};
</script>


<style lang='scss' scoped>
.kv {
  max-height: calc(100vh - 100px);
  .breadcrumb {
    position: fixed;
    height: 50px;
    width: 100%;
    width: width - 180px;
    line-height: 50px;
    border-bottom: 1px solid #cecece;
    background: #fefefe;
    padding-left: 15px;
    z-index: 99;
    .ivu-breadcrumb {
      font-size: 16px;
    }
    .breadcrumb-left {
      float: left;
      span {
        cursor: pointer;
      }
    }
    .btns {
      position: fixed;
      right: 10px;
      width: auto;
    }
  }
  .key-body {
    padding-top: 50px;
    border: 1px solid #dcdee2;
  }

  .split-left {
    padding-left: 10px;
    /deep/ .ivu-tree ul {
      font-size: 18px !important;
      li {
        margin: 3px 0;
      }
    }
  }
  .split-right {
    padding: 0 6px;
  }
}

</style>