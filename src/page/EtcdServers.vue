
<template>
  <div class="etcd-servers">
    <Card>
      <!-- 搜索和添加按钮 -->
      <div class="search">
        <div class="search-form">
          <Form :model="search" inline>
            <FormItem label="服务器名:" :label-width="80">
              <Input
                v-model="search.name"
                @on-enter="getList"
                placeholder="请输入服务器名..."
                style="width:200px;"
              />
            </FormItem>
            <FormItem>
              <Button type="primary" @click="getList">搜索</Button>
            </FormItem>
          </Form>
        </div>
        <div class="btns">
          <Button type="success" @click="modalAdd = true;info={tls_enable:'false',version:'v3'};">添加</Button>
        </div>
      </div>
      <!-- end 搜索和添加按钮 -->
      <Table border :columns="columns" :data="data1"></Table>
      <div class="page">
        <Page
          @on-change="changeListPage"
          @on-page-size-change="pageSizeChange"
          :total="total"
          :current="page"
          :page-size="pageSize"
          show-sizer
        />
      </div>
    </Card>

    <!-- 添加 -->
    <Modal v-model="modalAdd" :title="$t('public.add')" @on-ok="addOk">
      <Form :model="info" label-position="right" :label-width="100">
        <FormItem label="服务名:">
          <Input v-model="info.name" placeholder="请输入etcd服务名..." />
        </FormItem>
        <FormItem label="地址:">
          <Poptip trigger="focus">
            <Input v-model="info.address" type="textarea" placeholder="请输入地址，多个逗号分开..." style="width:388px" />
            <div slot="content">{{ info.address }}</div>
          </Poptip>
        </FormItem>
        <FormItem label="版本:">
          <Select v-model="info.version" style="width:200px">
            <Option value="v3">V3</Option>
            <Option value="v2">V2</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="前缀:">
          <Input v-model="info.prefix" placeholder="请输入key前缀，建议不为空..." />
        </FormItem> -->
        <FormItem label="用户名:">
          <Input v-model="info.username" placeholder="请输入用户名..." />
        </FormItem>
        <FormItem label="密码:">
          <Input v-model="info.password" placeholder="请输入密码..." />
        </FormItem>
        <FormItem label="TLS连接:">
          <Select v-model="info.tls_enable" style="width:200px">
            <Option value="false">否</Option>
            <Option value="true">是</Option>
          </Select>
        </FormItem>
        <FormItem label="cert:" v-show="info.tls_enable == 'true' && info.version == 'v3'">
          <Upload
            :action="baseUrl+'/v1/upload/content'"
            name="file"
            :on-success="uploadSuccessCert"
          >
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
        </FormItem>
        <FormItem label="key:" v-show="info.tls_enable == 'true' && info.version == 'v3'">
          <Upload :action="baseUrl+'/v1/upload/content'" name="file" :on-success="uploadSuccessKey">
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
        </FormItem>
        <FormItem label="ca:" v-show="info.tls_enable == 'true' && info.version == 'v3'">
          <Upload :action="baseUrl+'/v1/upload/content'" name="file" :on-success="uploadSuccessCa">
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
        </FormItem>
        <FormItem label="备注:">
          <Input
            v-model="info.desc"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入备注..."
          />
        </FormItem>
      </Form>
    </Modal>
    <!-- end 添加 -->

    <!-- 修改 -->
    <Modal v-model="modalEdit" :title="$t('public.edit')" @on-ok="editOk">
      <Form :model="edit" label-position="right" :label-width="100">
        <FormItem label="服务名:">
          <Input v-model="edit.name" placeholder="请输入etcd服务名..." />
        </FormItem>
        <FormItem label="地址:">
          <Poptip trigger="focus">
            <Input v-model="edit.address" type="textarea" placeholder="请输入地址，多个逗号分开..." style="width:388px" />
            <div slot="content">{{ edit.address }}</div>
          </Poptip>
        </FormItem>
        <FormItem label="版本:">
          <Select v-model="edit.version" style="width:200px">
            <Option value="v3">V3</Option>
            <Option value="v2">V2</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="前缀:">
          <Input v-model="edit.prefix" placeholder="请输入key前缀，建议不为空..." />
        </FormItem> -->
        <FormItem label="用户名:">
          <Input v-model="edit.username" placeholder="请输入用户名..." />
        </FormItem>
        <FormItem label="密码:">
          <Input v-model="edit.password" placeholder="请输入密码..." />
        </FormItem>
        <FormItem label="TLS连接:">
          <Select v-model="edit.tls_enable" style="width:200px">
            <Option value="false">否</Option>
            <Option value="true">是</Option>
          </Select>
        </FormItem>
        <FormItem label="cert:" v-show="edit.tls_enable == 'true' && info.version == 'v3'">
          <Upload
            :action="baseUrl+'/v1/upload/content'"
            name="file"
            :on-success="uploadSuccessCert"
          >
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
        </FormItem>
        <FormItem label="key:" v-show="edit.tls_enable == 'true' && info.version == 'v3'">
          <Upload :action="baseUrl+'/v1/upload/content'" name="file" :on-success="uploadSuccessKey">
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
        </FormItem>
        <FormItem label="ca:" v-show="edit.tls_enable == 'true' && info.version == 'v3'">
          <Upload :action="baseUrl+'/v1/upload/content'" name="file" :on-success="uploadSuccessCa">
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
        </FormItem>
        <FormItem label="备注:">
          <Input
            v-model="edit.desc"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入备注..."
          />
        </FormItem>
      </Form>
    </Modal>
    <!-- end 修改 -->

    <!-- 权限设置 -->
     <Modal v-model="modalRole" :title="$t('public.role')" @on-ok="roleOk">
       <Table :columns="columnsRole" :data="roleList"></Table>
     </Modal>

    <!-- end 权限设置 -->

  </div>
</template>
<script>
import { SERVER } from "@/api/server.js";
import { Config } from "@/config";

export default {
  data() {
    return {
      page: 1,
      total: 0,
      pageSize: 10,
      columns: [
        {
          title: "ID",
          key: "id"
        },
        {
          title: "Name",
          key: "name"
        },
        {
          title: "Address",
          key: "address"
        },
        {
          title: "Version",
          key: "version"
        },
        {
          title: "Tls enable",
          key: "tls_enable"
        },
        {
          title: "Created At",
          key: "created_at"
        },
        {
          title: "Updated At",
          key: "updated_at"
        },
        {
          title: "Desc",
          key: "desc"
        },
        {
          title: "Action",
          key: "action",
          width: 260,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: this.$t("etcdServer.determineRepairDirectory")
                  },
                  on: {
                    "on-ok": () => {
                      this.restore(params.row);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "warning",
                        size: "small"
                      },
                      style: {
                        marginRight: "5px"
                      }
                    },
                    this.$t("etcdServer.repairDirectory")
                  )
                ]
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.modify(params.row);
                    }
                  }
                },
                this.$t("public.edit")
              ),
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.roles(params.row);
                    }
                  }
                },
                this.$t("public.role")
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: this.$t("public.confirmDelete")
                  },
                  on: {
                    "on-ok": () => {
                      this.delete(params.row);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small"
                      },
                      style: {
                        marginRight: "5px"
                      }
                    },
                    this.$t("public.delete")
                  )
                ]
              ),
            ]);
          }
        }
      ],
      data: [],
      data1: [], // 分页用

      search: {}, // 搜索

      modalAdd: false, // 是否显示添加弹框
      info: {}, // 添加对象

      modalEdit: false, // 修改弹框
      edit: {}, // 修改对象

      baseUrl: "", // 上传文件根目录

      // 角色选择
      modalRole: false,
      roleList: [], // 权限信息
      columnsRole: [
        {
          title: "角色",
          key: "name"
        },
        {
          title: "读权限",
          key: "action0",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Checkbox",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    value: params.row.read,
                    'true-value': 1,
                    'false-value': 0,
                    disabled: this.roleList[params.index].write == 1 || params.row.role_id == 1
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    'on-change': (val) => {
                      if(val == 1){
                        this.roleList[params.index].read = 1
                      }else{
                        if (this.roleList[params.index].write == 1){
                          this.$Message.info("拥有读权限，写权限必须有")
                          params.row.read = 1
                          return false
                        }
                        this.roleList[params.index].read = 0
                      }
                    }
                  }
                },
                "读"
              )
            ]);
          }
        },
        {
          title: "写权限",
          key: "write",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Checkbox",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    value: params.row.write,
                    'true-value': 1,
                    'false-value': 0,
                    disabled: params.row.role_id == 1
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    'on-change': (val) => {
                      // console.log(val);
                      if(val == 1){
                        this.roleList[params.index].write = 1
                        this.roleList[params.index].read = 1
                      }else{
                        this.roleList[params.index].write = 0
                      }
                    }
                  }
                },
                "写"
              )
            ]);
          }
        }
      ]
    };
  },
  methods: {
    getList() {
      SERVER.GetEtcdServerList(this.search.name).then(response => {
        console.log(response);
        this.data = response.data || [];
        this.changeListPage(this.page);
      });
    },
    // 切换页码
    changeListPage(page) {
      // pageSize
      this.data1.splice(0, this.data1.length);
      this.data1 = this.data.slice(
        (page - 1) * this.pageSize,
        page * this.pageSize
      );
      // console.log(page);
    },
    // 页面打小
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.changeListPage(1);
      this.page = 1;
    },

    // 修复该服务目录问题
    restore(row) {
      console.log(row);
      SERVER.RestoreEtcdServer(row.id).then(response => {
        if (response.status == 200) {
          this.$Message.info("OK");
        }
      });
    },

    // 添加确定事件
    addOk() {
      SERVER.AddEtcdServer(this.info).then(response => {
        if (response.status == 200) {
          this.$Message.info("添加成功");
          this.getList();
        }
      });
    },

    // 第一个证书
    uploadSuccessCert(response, file, fileList) {
      this.info.cert_file = response.content
      this.edit.cert_file = response.content
    },

    // 第二个证书
    uploadSuccessKey(response, file) {
      this.info.key_file = response.content
      this.edit.key_file = response.content
    },

    // 第三个证书
    uploadSuccessCa(response, file) {
      this.info.ca_file = response.content
      this.edit.ca_file = response.content
    },

    // 修改
    modify(row) {
      // console.log(row)
      this.modalEdit = true;
      this.edit = row;
    },

    // 修改确定
    editOk() {
      SERVER.UpdateEtcdServer(this.edit).then(response => {
        if (response.status == 200) {
          this.$Message.info("修改成功");
          this.getList();
        }
      });
    },

    // 显示etcd角色分配弹框
    roles(row) {
      console.log(row)
      SERVER.GetRoles(row.id).then(response => {
        if (response.status == 200) {
          this.roleList = response.data
          this.modalRole = true
        }
      })
    },

    // 权限确定
    roleOk(){
      console.log(this.roleList);
      SERVER.SetRoles(this.roleList).then(response => {
        if (response.status == 200) {
          this.modalRole = false
          this.$Message.info("OK")
        }
      })
    },

    // 删除
    delete(row) {
        SERVER.Del(row.id).then(response => {
            if (response.status == 200) {
                this.getList();
            }
        })
    },

  },
  mounted() {
    this.baseUrl = Config.BaseUrl;
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
.etcd-servers {
  padding: 10px;
  max-height: calc(100vh - 100px);
  .page {
    margin-top: 10px;
    text-align: right;
  }
  .search {
    width: 100%;
    height: 42px;
    overflow: hidden;
    .search-form {
      float: left;
    }
    .btns {
      float: right;
    }
  }
}
</style>