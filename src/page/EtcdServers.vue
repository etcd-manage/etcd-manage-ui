
<template>
    <div class="etcd-servers">
        <Card>
            <!-- 搜索和添加按钮 -->
            <div class="search">
                <div class="search-form">
                    <Form :model="search" inline>
                        <FormItem label="服务器名:" :label-width="80">
                            <Input v-model="search.name" placeholder="请输入服务器名..." style="width:200px;"/>
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
                <Page @on-change="changeListPage" @on-page-size-change="pageSizeChange" :total="total" :current="page" :page-size="pageSize" show-sizer />
            </div>
        </Card>

        <!-- 添加 -->
        <Modal v-model="modalAdd" title="添加" @on-ok="addOk">
            <Form :model="info" label-position="right" :label-width="100">
            <FormItem label="服务名:">
                <Input v-model="info.name" placeholder="请输入etcd服务名..."/>
            </FormItem>
            <FormItem label="地址:">
                <Poptip trigger="focus" >
                    <Input v-model="info.address" placeholder="请输入地址，多个逗号分开..." style="width:388px"/>
                    <div slot="content">{{ info.address }}</div>
                </Poptip>
            </FormItem>
            <FormItem label="版本:">
                <Select v-model="info.version" style="width:200px">
                    <Option value="v3"> V3 </Option>
                    <Option value="v2"> V2 </Option>
                </Select>
            </FormItem>
            <FormItem label="前缀:">
                <Input v-model="info.prefix" placeholder="请输入key前缀，建议不为空..."/>
            </FormItem>
            <FormItem label="用户名:">
                <Input v-model="info.username" placeholder="请输入用户名..."/>
            </FormItem>
            <FormItem label="密码:">
                <Input v-model="info.password" placeholder="请输入密码..."/>
            </FormItem>
            <FormItem label="TLS连接:">
                <Select v-model="info.tls_enable" style="width:200px">
                    <Option value="false"> 否 </Option>
                    <Option value="true"> 是 </Option>
                </Select>
            </FormItem>
            <FormItem label="cert:" v-show="info.tls_enable == 'true'">
                <Upload action="//jsonplaceholder.typicode.com/posts/" name="file" @on-success="uploadSuccessCert">
                    <Button icon="ios-cloud-upload-outline">Upload files</Button>
                </Upload>
            </FormItem>
            <FormItem label="key:" v-show="info.tls_enable == 'true'">
                <Upload action="//jsonplaceholder.typicode.com/posts/" name="file" @on-success="uploadSuccessKey">
                    <Button icon="ios-cloud-upload-outline">Upload files</Button>
                </Upload>
            </FormItem>
            <FormItem label="ca:" v-show="info.tls_enable == 'true'">
                <Upload action="//jsonplaceholder.typicode.com/posts/" name="file" @on-success="uploadSuccessCa">
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
    </div>
</template>
<script>
import { SERVER } from "@/api/server.js";

export default {
    data() {
        return {
            page:1,
            total:0,
            pageSize:10,
            columns:[
                {
                    title: 'ID',
                    key: 'id'
                },
                {
                    title: 'Name',
                    key: 'name'
                },
                {
                    title: 'Address',
                    key: 'address'
                },
                {
                    title: 'Version',
                    key: 'version'
                },
                {
                    title: 'Tls enable',
                    key: 'tls_enable'
                },
                {
                    title: 'Desc',
                    key: 'desc'
                },
                {
                    title: 'Action',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Poptip', {
                                props: {
                                    confirm: true,
                                    title:this.$t('etcdServer.determineRepairDirectory')
                                },
                                on: {
                                    "on-ok": () => {
                                        this.restore(params.row);
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
                                }, this.$t('etcdServer.repairDirectory')),
                            ])
                        ]);
                    }
                }
            ],
            data:[],
            data1:[], // 分页用

            search:{}, // 搜索

            modalAdd: false, // 是否显示添加弹框
            info: {}, // 添加对象
        }
    },
    methods:{
        getList(){
            SERVER.GetEtcdServerList().then(response => {
                console.log(response);
                this.data = response.data || [];
                this.changeListPage(this.page);
            });
        },
        // 切换页码
        changeListPage(page){
            // pageSize
            this.data1.splice(0, this.data1.length);
            this.data1 = this.data.slice((page - 1) * this.pageSize, page * this.pageSize);
            console.log(page);
        },
        // 页面打小
        pageSizeChange(pageSize){
            this.pageSize = pageSize;
            this.changeListPage(1);
            this.page = 1;
        },

        // 修复该服务目录问题
        restore(row){
            console.log(row)
            SERVER.RestoreEtcdServer(row.id).then(response=>{
                if(response.status == 200){
                    this.$Message.info('OK');
                }
            })
        },

        // 添加确定事件
        addOk(){
            SERVER.AddEtcdServer(this.info).then(response => {
                if(response.status == 200){
                    this.$Message.info('添加成功');
                    this.getList();
                }
            });
        },

        // 第一个证书
        uploadSuccessCert(response, file){
            console.log(response, file);
        },

        // 第二个证书
        uploadSuccessKey(response, file){

        },

        // 第三个证书
        uploadSuccessCa(response, file){

        },


    },
    mounted(){
        this.getList();
    }
}
</script>

<style lang="scss" scoped>
    .etcd-servers{
        padding: 10px;
        .page{
            margin-top:10px; 
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