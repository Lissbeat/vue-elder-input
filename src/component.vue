<template>
  <div class="elder__input">
    <label :for="id" v-if="label" class="elder__input-label">
      {{ label }}
      <span v-if="isRequired" class="elder__input-label-required">*</span>
    </label>
    <div class="elder__input-wrapper">
      <slot name="left"></slot>
      <div
        class="elder__input-field"
        :class="{
          'elder__input-field--icon': icon,
          'elder__input-field--prefixed': hasPrefix,
          'elder__input-field--suffixed': hasSuffix,
          'elder__input-field--focus': focused,
          'elder__input-field--disabled': isDisabled,
          'elder__input-field--readonly': isReadonly,
          'elder__input-field--valid': hasValidation && valid,
          'elder__input-field--invalid': hasValidation && !valid
        }"
      >
        <label :for="id" v-if="hasPrefix" class="elder__input-prefix">
          <slot name="prefix">{{ prefix }}</slot>
        </label>
        <label v-if="hasIcon" :for="id" class="elder__input-icon">
          <slot name="icon">
            <font-awesome-icon v-if="icon" :icon="icon" />
          </slot>
        </label>
        <div class="elder__input-value">
          <slot>
            <component
              :is="component"
              :value="valueComp"
              v-on="{
                ...$listeners,
                input: update
              }"
              v-bind="{ ...$attrs, ...mask, type, id }"
              class="elder__input-element"
              :class="['elder__input--alignment-' + this.align]"
              ref="input"
              @focus="onFocus"
              @blur="onBlur"
            />
          </slot>
        </div>
        <label v-if="hasValidation" :for="id" class="elder__input-validation">
          <font-awesome-icon :icon="['fas', valid ? 'check-circle' : 'times-circle']" />
        </label>
        <label :for="id" v-if="hasSuffix" class="elder__input-suffix">
          <slot name="suffix">{{ suffix }}</slot>
        </label>
      </div>
      <slot name="right"></slot>
    </div>
    <slot name="below"></slot>
    <div
      v-if="hasValidation && hasValidationMessage && !valid"
      class="elder__input-validation-message"
    >
      <slot name="validation-message">{{ validationMessage }}</slot>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { IMaskComponent } from "vue-imask";
import { AttributeBoolean } from "./utils";

import "./icons";

export default {
  props: {
    value: [String, Number, Date],
    label: String,
    type: {
      type: String,
      default: "text"
    },
    mask: {
      type: Object,
      default: () => ({})
    },
    validate: [Boolean, Function],
    validationMessage: String,
    prefix: String,
    suffix: String,
    icon: [Array, String],
    align: {
      type: String,
      default: "left",
      enum: ["left", "right", "center"]
    }
  },
  watch: {
    value: {
      handler: "validateValue"
    }
  },
  computed: {
    valueComp() {
      return (this.value || "").toString();
    },
    component() {
      if (this.hasMask) return "i-mask-component";
      if (this.type === "textarea") return "textarea";
      return "input";
    },
    hasMask() {
      return this.mask.mask;
    },
    hasPrefix() {
      return this.prefix || this.$slots.prefix;
    },
    hasSuffix() {
      return this.suffix || this.$slots.suffix;
    },
    hasValidationMessage() {
      return this.validationMessage || this.$slots["validation-message"];
    },
    hasIcon() {
      return this.icon || this.$slots.icon;
    },
    hasValidation() {
      if (!this.isRequired && !this.value) return false;
      return this.visited && this.validate;
    },
    isDisabled: AttributeBoolean("disabled"),
    isRequired: AttributeBoolean("required"),
    isReadonly: AttributeBoolean("readonly")
  },
  data() {
    return {
      id: null,
      focused: false,
      visited: false,
      valid: false
    };
  },
  methods: {
    update(val) {
      let result = val.target ? val.target.value : val;
      if (this.type === "number" || this.mask.mask === Number)
        result = parseFloat(result);
      this.$emit("input", result);
    },
    validateValue() {
      if (!this.validate) return;

      if (typeof this.validate === "function")
        return (this.valid = this.validate(this.value));

      this.valid = (this.$refs.input.$el || this.$refs.input).checkValidity();
    },
    onFocus() {
      this.focused = true;
    },
    onBlur() {
      this.visited = true;
      this.focused = false;
    }
  },
  created() {
    this.id = this._uid;
    if (this.value) this.visited = true;
  },
  mounted() {
    this.validateValue();
  },
  components: {
    FontAwesomeIcon,
    IMaskComponent
  }
};
</script>

<style lang="scss">
.elder__input {
  $component: "elder__input";

  $primary: #3a9acd !default;
  $success: #33ca62 !default;
  $error: #e83b35 !default;
  $text-color: #222 !default;
  $border-color: #eaeaea !default;
  $border-radius: 3px !default;
  $spacing: 1.1em;

  $input-color: lighten($border-color, 4%);

  text-align: left;
  color: $text-color;
  display: flex;
  flex-direction: column;

  &-label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5em;

    &-required {
      color: $error;
    }
  }

  &-wrapper {
    display: flex;
    flex-grow: 1;
  }

  &-field {
    display: flex;
    position: relative;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    flex-grow: 1;
    background-color: white;

    &:not(:first-child) {
      margin-left: 0.5em;
    }

    &:not(:last-child) {
      margin-right: 0.5em;
    }

    &--focus {
      border-color: $primary;
    }

    &--readonly .#{$component}-value {
      color: rgba($text-color, 0.6);
    }

    &--disabled {
      background-color: lighten($input-color, 2%);
    }

    &.#{$component}-field--invalid {
      border-color: lighten($error, 25%);
    }
  }

  &--alignment-left {
    text-align: left;
  }
  &--alignment-right {
    text-align: right;
  }
  &--alignment-center {
    text-align: center;
  }

  &-suffix,
  &-prefix {
    padding: $spacing;
    background-color: $input-color;
    color: darken($border-color, 25%);
  }

  &-suffix {
    border-left: 1px solid $border-color;
    flex-shrink: 0;
  }

  &-prefix {
    border-right: 1px solid $border-color;
    flex-shrink: 0;
  }

  &-validation {
    display: flex;
    align-items: center;
    padding-right: $spacing;

    .#{$component}-field--invalid & {
      color: $error;
    }

    .#{$component}-field--valid & {
      color: $success;
    }
  }

  &-validation-message {
    color: $error;
    margin-top: 0.5em;
    font-size: 0.8em;
  }

  &-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: $spacing;

    & * {
      opacity: 0.5;
    }
  }

  &-value {
    display: flex;
    flex-grow: 1;
  }

  &-element {
    font: inherit;
    padding: $spacing;
    color: inherit;
    border: none;
    background-color: transparent;
    outline: none;
    -webkit-appearance: none;
    flex-grow: 1;
    width: 100%;

    &::-webkit-input-placeholder {
      color: rgba($text-color, 0.4);
    }
    &::-moz-placeholder {
      color: rgba($text-color, 0.4);
    }
    &:-ms-input-placeholder {
      color: rgba($text-color, 0.4);
    }
    &:-moz-placeholder {
      color: rgba($text-color, 0.4);
    }
  }
}
</style>
