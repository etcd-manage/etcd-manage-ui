<template>
  <div class="role">
    <Card>
      <!-- 搜索和添加按钮 -->
      <div class="search">
        <div class="btns">
          <Button type="success" @click="modalAdd = true;info={name:''};">添加</Button>
        </div>
      </div>
      <!-- end 搜索和添加按钮 -->
      <Table border :columns="columns" :data="list"></Table>
    </Card>
    <Modal v-model="modalAdd" :title="$t('public.add')" @on-ok="addOk">
      <Form :model="info" label-position="right" :label-width="100">
        <FormItem label="角色名:">
          <Input v-model="info.name" placeholder="请输入角色名称名..." />
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="modalEdit" :title="$t('public.edit')" @on-ok="editOk">
      <Form :model="edit" label-position="right" :label-width="100">
        <FormItem label="角色名:">
          <Input v-model="edit.name" placeholder="请输入角色名称名..." />
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>

<script>
import { Role } from "@/api/role.js";

export default {
  data() {
    return {
      // 添加
      modalAdd: false,
      info: {
          name: ''
      },
      // 编辑
      modalEdit: false,
      edit: {
          name: ''
      },

      // 列表
      list: [],
      columns: [
        {
          title: "ID",
          key: "id"
        },
        {
          title: "角色名",
          key: "name"
        },
        {
          title: "创建时间",
          key: "created_at"
        },
        {
          title: "更新时间",
          key: "updated_at"
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
                    title: this.$t("public.confirmDelete")
                  },
                  style: {
                    display:(params.row.id == 1) ? "none" : "inline-block",
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
              )
            ]);
          }
        }
      ]
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      Role.GetAll().then(response => {
        if (response.status == 200) {
          this.list = response.data;
        }
      });
    },
    // 删除
    delete(row) {
        Role.Del(row.id).then(response => {
            if (response.status == 200) {
                this.getList();
            }
        })
    },
    // 编辑
    modify(row) {
        this.modalEdit = true;
        this.edit = row;
    },
    // 添加
    addOk() {
      if (this.info.name == "") {
        this.$Message.warning("角色名不能为空");
        return;
      }
      Role.Add(this.info).then(response => {
        if (response.status == 200) {
          this.getList();
        }
      });
    },
    // 保存修改
    editOk(){
        Role.Save(this.edit).then(response => {
        if (response.status == 200) {
          this.getList();
        }
      });
    }

  }
};
</script>

<style lang='scss' scoped>
.role {
  padding: 10px;
  max-height: calc(100vh - 100px);
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