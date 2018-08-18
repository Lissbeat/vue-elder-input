<template>
  <div class="elder__input">
    <label :for="id" v-if="label" class="elder__input-label">
      {{ label }}
      <span v-if="required" class="elder__input-label-required">*</span>
    </label>
    <div 
      class="elder__input-field" 
      :class="{ 
        'elder__input-field--icon': icon, 
        'elder__input-field--prefixed': hasPrefix, 
        'elder__input-field--suffixed': hasSuffix,
        'elder__input-field--focus': focused,
        'elder__input-field--disabled': disabled,
        'elder__input-field--readonly': readonly,
        'elder__input-field--valid': valid,
      }"
    >
      <label :for="id" v-if="hasPrefix" class="elder__input-prefix">
        <slot name="prefix">{{ prefix }}</slot>
      </label>
      <label v-if="icon" :for="id" class="elder__input-icon">
        <fa v-if="icon" :icon="icon"></fa>
      </label>
      <textarea 
        v-if="!mask && type === 'textarea'" 
        v-model="valueComp"
        ref="input"
        :id="id"
        class="elder__input-value"
        :placeholder="placeholder" 
        :required="required" 
        :readonly="readonly" 
        :autofocus="autofocus" 
        :pattern="pattern"
        :class="alignmentClass"
        @focus="focused = true"
        @blur="focused = false"
      ></textarea>  
      <input 
        v-else-if="!mask" 
        v-model="valueComp" 
        ref="input"
        :type="type" 
        :id="id"
        class="elder__input-value"
        :disabled="disabled" 
        :placeholder="placeholder" 
        :readonly="readonly" 
        :required="required" 
        :autofocus="autofocus" 
        :class="alignmentClass"
        :pattern="pattern"
        @focus="focused = true" 
        @blur="focused = false" 
      />
      <i-mask-component
        v-else
        v-model="valueComp"
        ref="input"
        :unmask="mask.unmask"
        :thousandsSeparator="mask.thousandsSeparator"
        :mask="mask.mask"
        :placeholderChar="mask.placeholderChar"
        :id="id"
        class="elder__input-value"
        :disabled="disabled" 
        :placeholder="placeholder" 
        :readonly="readonly" 
        :required="required" 
        :autofocus="autofocus" 
        :class="alignmentClass"
        @focus.native="focused = true" 
        @blur.native="focused = false" 
      />
      <label v-if="valid" :for="id" class="elder__input-validation">
        <fa :icon="['fas', 'check-circle']"></fa>
      </label>
      <label :for="id" v-if="hasSuffix" class="elder__input-suffix">
        <slot name="suffix">{{ suffix }}</slot>
      </label>
    </div>
  </div>
</template>

<script>
import { DateToInputDateString, DateToInputTimeString, InputTimeStringToDate, ConvertToString } from './utils'
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome'
import { IMaskComponent } from 'vue-imask'

import './icons'

export default {
  props: {
    value: [String, Number, Date],
    label: String,
    type: {
      type: String,
      default: 'text',
    },
    disabled: Boolean,
    mask: Object,
    validate: Boolean,
    readonly: Boolean,
    required: Boolean,
    autofocus: Boolean,
    pattern: String,
    placeholder: String,
    prefix: String,
    suffix: String,
    icon: [Array, String],
    align: {
      type: String,
      default: 'left',
      enum: ['left', 'right', 'center'],
    },
  },
  computed: {
    hasPrefix() {
      return this.prefix || this.$slots.prefix
    },
    hasSuffix() {
      return this.suffix || this.$slots.suffix
    },
    inputElementType() {
      if (this.type === 'textarea') return 'textarea'
      return 'input'
    },
    alignmentClass() {
      return 'elder__input--alignment-' + this.align
    },
    valueComp: {
      get() {
        if (this.mask) return ConvertToString(this.value)
        if (this.type === 'date') return DateToInputDateString(this.value)
        if (this.type === 'time') return DateToInputTimeString(this.value)
        return this.value
      },
      set(val) {
        this.validateValue()
        if (this.type === 'number')
          val = parseFloat(val.replace(new RegExp(',', 'g'), '.').replace(new RegExp('[^\\d.]', 'g'), ''))
        if (this.type === 'date') val = new Date(val)
        if (this.type === 'time') val = InputTimeStringToDate(val, this.value)
        this.$emit('input', val)
      },
    },
  },
  data() {
    return {
      id: null,
      focused: false,
      valid: false,
    }
  },
  methods: {
    validateValue() {
      let target = this.$refs.input.$el ? this.$refs.input.$el : this.$refs.input
      if (!target.value || !this.validate) return
      this.valid = target.checkValidity()
    },
  },
  created() {
    this.id = this._uid
  },
  mounted() {
    this.validateValue()
  },
  components: {
    Fa,
    IMaskComponent,
  },
}
</script>

<style lang="scss">
@import '~node_modules/vue-elder-defaults/styles/variables';

$border-color: #eaeaea;
$input-background: lighten($border-color, 4%);
$spacing: 1.1em;

.elder__input {
  &-label {
    font-weight: bold;

    &-required {
      color: $error;
    }

    & + .elder__input-field {
      margin-top: 0.5em;
    }
  }

  &-field {
    display: flex;
    position: relative;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    overflow: hidden;
    background-color: white;

    &--focus {
      border-color: $primary;
    }

    &--readonly .elder__input-value {
      color: rgba($text-color, 0.6);
    }

    &--disabled {
      background-color: lighten($input-background, 2%);
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
    background-color: $input-background;
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
    color: $success;
    display: flex;
    align-items: center;
    padding-right: $spacing;
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
    font: inherit;
    padding: $spacing;
    border: none;
    background-color: transparent;
    outline: none;
    -webkit-appearance: none;
    flex-grow: 1;

    &::-webkit-input-placeholder {
      color: $text-color;
      opacity: 0.4;
    }
    &::-moz-placeholder {
      color: $text-color;
      opacity: 0.4;
    }
    &:-ms-input-placeholder {
      color: $text-color;
      opacity: 0.4;
    }
    &:-moz-placeholder {
      color: $text-color;
      opacity: 0.4;
    }
  }
}
</style>
