(function(){
  Parse.initialize("265RdtKjvGmVHSwHQXDXv2XXw7aGP5BfG175jjha",
      "RNHeGkUvVEc8DUMJCbtbpCPUOdxWbtuKB7TkhChZ");
	  
  //編譯template engine函數();
  
  var templates = {};
  ['loginView', 'evaluationView', 'updateSuccessView'].forEach(function(e){
    var tpl = document.getElementById(e).text;
    templates[e] = doT.template(tpl);
  });

  //可選-編寫共用函數();
  
  
  var handler = {
    navbar: function(){
	  var currentUser = Parse.User.current();
      if(currentUser){
        //顯示哪些button();
		document.getElementById("loginButton").style.display="none";
		document.getElementById("evaluationButton").style.display="block";
	    document.getElementById("logoutButton").style.display="block";
      } else {
       // 顯示哪些button();      
	    document.getElementById("loginButton").style.display="block";
	    document.getElementById("evaluationButton").style.display="none";
	    document.getElementById("logoutButton").style.display="none";
      }
    },
    loginView: function(){
	  document.getElementById('content').innerHTML = templates.loginView();
	  
     // 綁定登入表單的學號檢查事件(); // 可以利用TAHelp物件
     // 綁定註冊表單的學號檢查事件(); // 可以利用TAHelp物件
     // 綁定註冊表單的密碼檢查事件(); // 參考上課範例
     // 綁定登入表單的登入檢查事件(); // 送出還要再檢查一次，這裡會用Parse.User.logIn
     // 綁定註冊表單的註冊檢查事件(); // 送出還要再檢查一次，這裡會用Parse.User.signUp和相關函數
    },
    evaluationView: function(){
      // 基本上和上課範例購物車的函數很相似，這邊會用Parse DB
     // 問看看Parse有沒有這個使用者之前提交過的peer review物件(
     // 沒有的話: 從TAHelp生一個出來(加上scores: [‘0’, ‘0’, ‘0’, ‘0’]屬性存分數並把自己排除掉)
     // 把peer review物件裡的東西透過版型印到瀏覽器上();
     // 綁定表單送出的事件(); // 如果Parse沒有之前提交過的peer review物件，要自己new一個。或更新分數然後儲存。
      //);
    },
  };
	
	var r = Parse.Router.extend({
		routes: {
			'': 'index',
			'peer-evaluation': 'evaluation',
			'login/*redirect': 'login',
		},
		login: handler.loginView,
		evaluation: handler.evaluationView,
	});
 
	this.Router = new r();
	Parse.history.start();
	handler.navbar();
	
})();
