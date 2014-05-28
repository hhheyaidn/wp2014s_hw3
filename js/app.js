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
  
  var t={
	loginRequiredView:function(e){
		return function(){
			var current=Parse.User.current();
			if(current){
				e()
			}
			else{
				window.location.hash="login/"+window.location.hash
			}
		}
	}
	};
  
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
	  document.getElementById("logoutButton").addEventListener('click',function(){
		Parse.User.logOut();
		handler.navbar();
		window.location.hash="login/"
		})
    },
    loginView: function(redirect){
	  document.getElementById('content').innerHTML = templates.loginView();
	  
     // 綁定登入表單的學號檢查事件(); // 可以利用TAHelp物件
     // 綁定註冊表單的學號檢查事件(); // 可以利用TAHelp物件
	 
	  var message = '此學號不在修課名單內，請重試。';
	  document.getElementById('form-signin-message').innerHTML = message;
	  document.getElementById('form-signup-message').innerHTML = message;
	  
	  document.getElementById('form-signin-student-id').addEventListener('keyup', function(){
		if(TAHelp.getMemberlistOf(this.value)==false){	  
			document.getElementById('form-signin-message').style.display="block";
		  }
		 else
			document.getElementById('form-signin-message').style.display="none";
			});
		
	  document.getElementById('form-signup-student-id').addEventListener('keyup', function(){
		if(TAHelp.getMemberlistOf(this.value)==false){	  
			document.getElementById('form-signup-message').style.display="block";
		  }
		 else
			document.getElementById('form-signup-message').style.display="none";
        });
	 
     // 綁定註冊表單的密碼檢查事件(); // 參考上課範例
     // 綁定登入表單的登入檢查事件(); // 送出還要再檢查一次，這裡會用Parse.User.logIn
     // 綁定註冊表單的註冊檢查事件(); // 送出還要再檢查一次，這裡會用Parse.User.signUp和相關函數
	  var currentUser = Parse.User.current();
      // What to do after signin / signup is successfully performed.
      var postAction = function(){
        handler.navbar();
        window.location.hash = t ? t : '';
      }
      
      if (currentUser) {
        window.location.hash = '';
      } else {
        // Signin Function binding, provided by Parse SDK.        
        document.getElementById('form-signin').addEventListener('submit', function(){
          Parse.User.logIn(document.getElementById('form-signin-student-id').value,
              document.getElementById('form-signin-password').value, {
            success: function(templates) {
              // Do stuff after successful login.
              postAction();
			  console.log(user);
            },
            error: function(user, error) {
              // The login failed. Check error to see why.
            }
          }); 
        });
        // Signup Form Password Match Check Binding.
        document.getElementById('form-signup-password1').addEventListener('keyup', function(){
          var singupForm_password = document.getElementById('form-signup-password');
          var message = (this.value !== singupForm_password.value) ? '密碼不一致，請再確認一次。' : '';
          document.getElementById('form-signup-message').innerHTML = message;
		  if(this.value !== singupForm_password.value)
			document.getElementById('form-signup-message').style.display="block";
          else
			document.getElementById('form-signup-message').style.display="none";
		});
        // Signup Function binding, provided by Parse SDK.
        document.getElementById('form-signup').addEventListener('submit', function(){
          var user = new Parse.User();
          user.set("username", document.getElementById('form-signup-student-id').value);
          user.set("password", document.getElementById('form-signup-password').value);
          user.set("email", document.getElementById('form-signup-email').value);
 
          user.signUp(null, {
            success: function(user) {
              postAction();
              // Hooray! Let them use the app now.
            },
            error: function(user, error) {
              // Show the error message somewhere and let the user try again.
              document.getElementById('form-signup-message').innerHTML = error.message + '['+error.code+']';
            }
          });
        }, false);
      } 
	 
    },
	evaluationView:t.loginRequiredView(function(){
			var t=Parse.Object.extend("Evaluation");
			var n=Parse.User.current();
			var r=new Parse.ACL;
			r.setPublicReadAccess(false);
			r.setPublicWriteAccess(false);
			r.setReadAccess(n,true);
			r.setWriteAccess(n,true);
			var i=new Parse.Query(t);
			i.equalTo("user",n);
			i.first({
				success:function(i){
					window.EVAL=i;
					if(i===undefined){
						var s=TAHelp.getMemberlistOf(n.get("username")).filter(function(e){
							return e.StudentId!==n.get("username")?true:false
						}).map(function(e){
							e.scores=["0","0","0","0"];
							return e
						})
					}
					else{
						var s=i.toJSON().evaluations
					}
					document.getElementById("content").innerHTML=e.evaluationView(s);
					document.getElementById("evaluationForm-submit").value=i===undefined?"提交表單":"修改表單";
					document.getElementById("evaluationForm").addEventListener("submit",function(){
						for(var o=0;o<s.length;o++){
							for(var u=0;u<s[o].scores.length;u++){
								var a=document.getElementById("stu"+s[o].StudentId+"-q"+u);
								var f=a.options[a.selectedIndex].value;s[o].scores[u]=f
							}
						}
						if(i===undefined){
							i=new t;
							i.set("user",n);
							i.setACL(r)}console.log(s);
							i.set("evaluations",s);
							i.save(null,{
								success:function(){
									document.getElementById("content").innerHTML=e.updateSuccessView()
								},
								error:function(){

								}
							})
					},false);
				},
				error:function(e,t){

				}
			})
		}),
  };
	
	var r = Parse.Router.extend({
		routes: {
			'': 'index',
			'peer-evaluation': 'evaluation',
			'login/*redirect': 'login',
		},
		index: handler.loginView,
		login: handler.loginView,
		evaluation: handler.evaluationView,
	});
	this.Router = new r();
	Parse.history.start();
	handler.navbar();
})();