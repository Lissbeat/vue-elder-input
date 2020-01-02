const AttributeBoolean = key => {
  return function() {
    return ["", true, "true"].includes(this.$attrs[key]);
  };
};

export { AttributeBoolean };
