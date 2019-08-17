<template>
  <div class="role">
      <Card>
          <Table border :columns="columns" :data="list"></Table>
      </Card>
  </div>
</template>

<script>
import { Role } from "@/api/role.js";

export default {
    data() {
        return {
            list: [],
            columns: [
                {
                    title: 'ID',
                    key: 'id'
                },
                {
                    title: '角色名',
                    key: 'name'
                },
                {
                    title: '创建时间',
                    key: 'created_at'
                },
                {
                    title: '更新时间',
                    key: 'updated_at'
                },
                {
                    title: 'Action',
                    key: 'action',
                    width: 260,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Poptip', {
                                props: {
                                    confirm: true,
                                    title:this.$t('public.confirmDelete')
                                },
                                on: {
                                    "on-ok": () => {
                                        this.delete(params.row);
                                    }
                                }
                            },[
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, this.$t('public.delete')),
                            ]),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.modify(params.row);
                                    }
                                }
                            }, this.$t('public.edit')),
                        ]);
                    }
                }
            ],
        }
    },
    mounted() {
    },
    methods: {
        // 获取列表
        getList(){

        },
        // 删除
        delete(row){

        },
        // 编辑
        modify(row){

        }
    }
}
</script>

<style lang='scss' scoped>
.role {

}
</style>