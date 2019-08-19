
<template>
  <div class="user">
    <Card>
      <!-- 搜索和添加按钮 -->
      <div class="search">
        <div class="search-form">
          <Form :model="search" inline>
            <FormItem label="角色:" :label-width="80">
              <Select v-model="search.roleId" style="width:200px">
                <Option :value="0">全部</Option>
                <Option v-for="item in roles" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="用户名:" :label-width="80">
              <Input
                v-model="search.name"
                @on-enter="getList"
                placeholder="用户名..."
                style="width:200px;"
              />
            </FormItem>
            <FormItem label="用户ID:" :label-width="80">
              <Input
                v-model="search.userId"
                @on-enter="getList"
                placeholder="用户ID..."
                style="width:100px;"
              />
            </FormItem>
            <FormItem>
              <Button type="primary" @click="getList">搜索</Button>
            </FormItem>
          </Form>
        </div>
        <div class="btns">
          <Button type="success" @click="modalAdd = true;info={};">添加</Button>
        </div>
      </div>
      <!-- end 搜索和添加按钮 -->
      <Table border :columns="columns" :data="data"></Table>
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
        <FormItem label="用户名:">
          <Input v-model="info.username" placeholder="请输入用户名..." />
        </FormItem>
        <FormItem label="密码:">
          <Input v-model="info.password" type="password" placeholder="请输入密码..." />
        </FormItem>
        <FormItem label="邮箱:">
          <Input v-model="info.email" type="email" placeholder="请输入邮箱..." />
        </FormItem>
        <FormItem label="角色:">
          <Select v-model="info.role_id">
            <Option v-for="item in roles" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <!-- end 添加 -->

    <!-- 修改 -->
    <Modal v-model="modalEdit" :title="$t('public.edit')" @on-ok="editOk">
      <Form :model="edit" label-position="right" :label-width="100">
        <FormItem label="用户名:">
          <Input v-model="edit.username" placeholder="请输入用户名..." />
        </FormItem>
        <FormItem label="密码:">
          <Input v-model="edit.password" type="password" placeholder="不为空修改，为空不修改..." />
        </FormItem>
        <FormItem label="邮箱:">
          <Input v-model="edit.email" type="email" placeholder="请输入邮箱..." />
        </FormItem>
        <FormItem label="角色:">
          <Select v-model="edit.role_id">
            <Option v-for="item in roles" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <!-- end 修改 -->
  </div>
</template>
<script>
import { User } from "@/api/user.js";
import { Role } from "@/api/role.js";

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
          title: "用户名",
          key: "username"
        },
        {
          title: "邮箱",
          key: "email"
        },
        {
          title: "角色",
          key: "role_name"
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
                    display:(params.row.username == 'admin') ? "none" : "inline-block",
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
      ],
      data: [],

      search: { roleId: 0, userId: "", name: "" }, // 搜索
      roles: [], // 角色列表

      modalAdd: false, // 是否显示添加弹框
      info: {}, // 添加对象

      modalEdit: false, // 修改弹框
      edit: {} // 修改对象
    };
  },
  methods: {
    // 获取角色列表
    getRoles() {
      Role.GetAll().then(response => {
        if (response.status == 200) {
          this.roles = response.data;
        }
      });
    },
    // 获取列表数据
    getList() {
      User.GetList(
        this.search.userId,
        this.search.name,
        this.search.roleId,
        this.page,
        this.pageSize
      ).then(response => {
        if (response.status == 200) {
          this.data = response.data.list || [];
          this.total = response.data.total;
        }
      });
    },
    // 切换页码
    changeListPage(page) {
      this.page = page;
      this.getList();
    },
    // 页面打小
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.changeListPage(1);
    },

    // 添加确定事件
    addOk() {
      if (this.info.role_id <= 0){
        this.$Message.info("请选择角色角色");
        return;
      }
      User.Add(this.info).then(response => {
        if (response.status == 200) {
          this.$Message.info("添加成功");
          this.getList();
        }
      });
    },

    // 修改
    modify(row) {
      // console.log(row)
      this.modalEdit = true;
      this.edit = row;
    },

    // 修改确定
    editOk() {
      User.Save(this.edit).then(response => {
        if (response.status == 200) {
          this.$Message.info("修改成功");
          this.getList();
        }
      });
    },

    // 删除
    delete(row) {
      User.Del(row.id).then(response => {
        if (response.status == 200) {
          this.$Message.info("删除成功");
          this.getList();
        }
      });
    }
  },
  mounted() {
    this.getRoles();
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
.user {
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