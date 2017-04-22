const containerize = (clazz) => class extends clazz {
  children = [];
  add (child) {
    this.children.push(child);
  }

  remove (child) {
    this.children = this.children.filter(c => c !== child);
  }

  map (f) {
    return this.children.map(f);
  }

  update (dt, t) {
    this.children = this.children.filter(child => {
      if (child.update) {
        child.update(dt, t, this);
      }
      return child.dead ? false : true;
    });
  }
};

export default containerize;
