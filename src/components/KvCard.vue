<template>
  <div class="key-card">
    <Row :gutter="8">
      <Col span="4" v-for="(item,key) in list" :key="key">
        <Card class="card">
          <div class="one-card" @click.stop="openKey(item)">
            <Row>
              <Col span="2" class="left">
                <Checkbox class="checkbox" v-model="item.check" v-if="item.is_dir==false"></Checkbox>
              </Col>
              <Col span="20" class="centre">
                <h5>{{ item.path }}</h5>
                <p>{{item.name}}</p>
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
    .ivu-card-body{
        padding: 10px 3px;
    }
  .one-card {
      .left {
          text-align: center;
      }
      .centre{
          text-align: left;
      }
      .right{
          text-align: center;
      }
    .key-icon {
      width: 90%;
      height: auto;
    }
  }
}
</style>
