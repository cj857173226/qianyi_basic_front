let tf = true;
export function checkSesstion() {
  if (
    !window.sessionStorage.length ||
    window.sessionStorage.length === 1 ||
    window.sessionStorage.length === 2
  ) {
    window.localStorage.setItem("getSessionStorage", Date.now());
  }
  window.addEventListener("storage", function(event) {
    if (event.key == "getSessionStorage") {
      // 已存在的标签页
      window.localStorage.setItem(
        "sessionStorage",
        JSON.stringify(window.sessionStorage)
      );
      window.localStorage.removeItem("sessionStorage");
    } else if (
      event.key == "sessionStorage" &&
      (!window.sessionStorage.length ||
        window.sessionStorage.length === 1 ||
        window.sessionStorage.length === 2)
    ) {
      // 新开启的标签页
      var data = JSON.parse(event.newValue),
        value;
      for (const key in data) {
        window.sessionStorage.setItem(key, data[key]);
      }
      if (
        JSON.parse(window.sessionStorage.getItem("qycloud-refresh_token")) &&
        JSON.parse(window.sessionStorage.getItem("qycloud-refresh_token"))
          .content
      ) {
        window.location.href =
          window.location.origin +
          window.location.pathname +
          "#/home/index";
        window.location.reload();
      }
    }
  });
}
