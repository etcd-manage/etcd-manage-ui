<template>
  <div class="key-card">
    <Row :gutter="10">
      <Col span="6" v-for="(item,key) in list" :key="key">
        <Card class="card">
          <div class="one-card" @click.stop="openKey(item)">
            <Row>
              <Col span="2" class="left">
              <div class="left-body" @click.stop="checkKey(item)">
                <Checkbox class="checkbox" v-model="item.check" v-if="item.is_dir==false"></Checkbox>
                <Checkbox
                  class="checkbox"
                  v-model="item.check"
                  v-else="item.is_dir==false"
                  disabled
                  @click="checkKey(item)"
                ></Checkbox>
              </div>
              </Col>
              <Col span="20" class="centre">
                <Tooltip placement="bottom" max-width="500" transfer>
                  <div class="path">{{ item.path }}</div>
                  <div class="value">{{item.value}}</div>
                  <div slot="content">
                      <p>{{ item.path }}</p>
                      <p><pre>{{item.value}}</pre></p>
                  </div>
                </Tooltip>
              </Col>
              <Col span="2" class="right">
                <img
                  v-if="item.is_dir==false"
                  src="../assets/imgs/file.png"
                  alt="file"
                  class="key-icon"
                />
                <img
                  v-if="item.is_dir==true"
                  src="../assets/imgs/folder.png"
                  alt="file"
                  class="key-icon"
                />
              </Col>
            </Row>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import { KV } from "@/api/kv.js";

// grid方式展示key
export default {
  data() {
    return {
      list: [],
      dir: "", // 要显示的目录
      selected: [] // 选中的key
    };
  },
  mounted() {},
  methods: {
    getList(dir) {
      this.list = [];
      this.dir = dir;
      KV.GetKeyList(dir).then(response => {
        this.list = response.data || [];
        // console.log(response);
      });
    },
    checkKey(item) {
      item.check = !item.check;

      let selected = [];
      this.list.forEach(val => {
        // console.log(val)
        if (val.check == true) {
          selected.push(val);
        }
      });
      this.selected = selected;
      console.log(selected);
    },
    openKey(item) {
      this.$emit("openKey", item);
    },
    // 清除
    clearSelected() {
      this.selected = [];
    }
  }
};
</script>

<style lang="scss" scoped>
.key-card {
  padding: 10px;
  padding-top: 0px;
  .card {
    background: #fcfcfc;
    margin-top: 10px;
  }
  .one-card {
    min-height: 50px;
    .left {
      text-align: center;
      .left-body{
        margin-top: 12px;
      }
    }
    .centre {
      text-align: left;
      .path {
        word-wrap: break-word;
        word-break: normal;
        font-weight: 600;
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
      }
      .value{
        overflow: hidden;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }
    }
    .right {
      text-align: center;
      img {
        margin: 0 auto;
        margin-top: 12px;
      }
    }
    .key-icon {
      width: 28px;
      height: auto;
    }
  }
}
</style>
