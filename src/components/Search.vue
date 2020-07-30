/**
 * 查询条件组件
 */
<template>
  <div class="formSearch">
    <div class="table-header" v-if="tableSearch && tableSearch.length > 0">
      <el-form
        size="small"
        :rules="rules"
        :model="formSearch"
        :inline="true"
        ref="formSearch"
        label-position="right"
        v-bind="{'label-width': '110px', ...(options && options.formProps)}"
      >
        <el-form-item
          class="table-header-item"
          :label="item.label + '：'"
          :prop="item.value"
          :key="index"
          v-bind="item.labelProps"
          v-for="(item, index) in tableSearch"
        >
          <el-select
            clearable
            v-bind="item.props"
            v-if="item.type === 'select'"
            v-model="formSearch[item.value]"
            :placeholder="`请选择${item.placeholder || item.label}`"
          >
            <el-option
              v-for="option in item.children"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
          <el-date-picker
            clearable
            style="width: 100%;"
            placeholder="选择日期"
            v-bind="item.props || {type: 'date'}"
            v-else-if="item.type === 'picker'"
            v-model="formSearch[item.value]"
          />
          <el-input
            v-else
            clearable
            v-bind="item.props"
            :type="item.inputType || 'text'"
            v-model="formSearch[item.value]"
            :placeholder="`请输入${item.placeholder || item.label}`"
            :maxlength="item.maxlength"
            @keyup.enter.native="handleSearch"
            :oninput="handleChangeInput(item)"
          />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button
            plain
            size="small"
            icon="el-icon-refresh-right"
            @click="handleReset('formSearch')"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { convertParams } from "@/util/utilTool";

let methods = {
  // 搜索查询按钮
  handleSearch() {
    if (this.rules) {
      return this.$refs["formSearch"].validate(valid => {
        if (!valid) return false;
        this.$emit(
          "handleSearch",
          convertParams(Object.assign({}, this.formSearch))
        );
      });
    }
    this.$emit(
      "handleSearch",
      convertParams(Object.assign({}, this.formSearch))
    );
  },

  // 搜索重置按钮
  handleReset(formName) {
    this.$refs[formName].resetFields();
    this.formSearch = this.reset ? { ...this.value } : {};
    this.$emit("handleReset");
    if (this.reset) return false;
    this.handleSearch();
  },

  // input为number校验
  handleChangeInput(item) {
    return item.inputType === "number"
      ? this.handleOnInput(
          this.formSearch[item.value],
          item.value,
          item.rulesLength,
          item.maxlength
        )
      : null;
  },

  // input渲染长度校验
  handleOnInput(val, label, rulesLength, maxlength = 11) {
    if (val && Number(val) <= 0) {
      this.formSearch[label] = 0;
    }
    if (rulesLength && val && val.length > maxlength) {
      this.formSearch[label] = this.formSearch[label].slice(0, maxlength);
    }
  }
};

export default {
  name: "FormSearch",
  props: {
    tableSearch: {
      type: Array
    },
    rules: {
      type: Object
    },
    value: {
      type: Object
    },
    reset: {
      type: Boolean
    },
    rulesLength: {
      type: Boolean
    },
    options: Object,
  },

  data() {
    return {
      formSearch: {
        ...this.value
      }
    };
  },

  methods,

  watch: {
    value(val) {
      if (val) return (this.formSearch = { ...this.value });
    }
  }
};
</script>

<style lang="less" scoped>
.table-header {
  padding-top: 10px;
  .table-header-item .el-form-item {
    width: 100%;
    display: flex;
    margin-bottom: 12px;
    .el-form-item__content,
    .el-select {
      width: 100%;
    }
  }
}
</style>
