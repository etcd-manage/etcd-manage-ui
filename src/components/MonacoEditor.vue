<template>
  <div class="myEditor">
    <div class="top-btn">
        <!-- <Button type="success" @click="RunResult">测试</Button> -->
      <span class="theme" style="float:left">
        <Select v-model="selLanguage" @on-change="languageChange" placeholder="选择语言">
          <Option v-for="item in languages" :key="item" :value="item">{{ item }}</Option>
        </Select>
      </span>
      <span class="theme" style="float:right">
        <Select v-model="theme" @on-change="themeChange" placeholder="请选择主题">
          <Option v-for="item in themeOption" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
      </span>
    </div>
    <div id="container" ref="container" :style="{height:height, width: width}"></div>
  </div>
</template>
<script>
import * as monaco from "monaco-editor";
export default {
  props: {
    codes: {
      type: String,
      default: function() {
        return "";
      }
    },
    language: {
      type: String,
      default: function() {
        return "json";
      }
    },
    height: {
      type: String,
      default: function() {
        return "100%";
      }
    },
    width: {
      type: String,
      default: function() {
        return "100%";
      }
    },
    editorOptions: {
      type: Object,
      default: function() {
        return {
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false, // 只读
          cursorStyle: "line", //光标样式
          automaticLayout: false, //自动布局
          glyphMargin: true, //字形边缘
          useTabStops: false,
          fontSize: 28, //字体大小
          autoIndent: true, //自动布局
          quickSuggestionsDelay: 500 //代码提示延时
        };
      }
    }
  },
  data() {
    return {
      // 主题
      themeOption: [
        {
          value: "vs",
          label: "浅色"
        },
        {
          value: "hc-black",
          label: "高亮"
        },
        {
          value: "vs-dark",
          label: "深色"
        }
      ],
      // 语言
      languages: ["json", "yaml", "ini", "lua", "xml", "javascript"],
      selLanguage: '', // 主动选择的语言
      theme: "vs-dark",
      codesCopy: null //内容备份
    };
  },
  mounted() {
    this.selLanguage = this.language;
    this.initEditor();
  },
  methods: {
    initEditor() {
      let self = this;
      self.codesCopy = '';
      self.$refs.container.innerHTML = "";
      self.monacoEditor = monaco.editor.create(self.$refs.container, {
        value: self.codesCopy || self.codes,
        language: self.selLanguage,
        theme: self.theme, //vs, hc-black, or vs-dark
        editorOptions: self.editorOptions
      });
      self.$emit("onMounted", self.monacoEditor); //编辑器创建完成回调
      self.monacoEditor.onDidChangeModelContent(function(event) {
        //编辑器内容changge事件
        self.codesCopy = self.monacoEditor.getValue();
        self.$emit("onCodeChange", self.monacoEditor.getValue(), event);
      });
      //编辑器随窗口自适应
      window.addEventListener("resize", function() {
        self.initEditor();
      });
    },
    getValue() {
      return this.monacoEditor.getValue();
    },
    themeChange(val) {
      this.initEditor();
    },
    languageChange(val) {
      this.initEditor();
    }
  }
};
</script>
<style scoped>
#container {
  text-align: left;
}
.top-btn{
    width: 100%;
    height: 38px;
}
</style>