import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';

export default function run_demo(root) {
  ReactDOM.render(<Demo channel/>, root);
}

const Login = () => {
  return(
    <div>
      <div className="form-group">
        Name<br/>
      <input type="text_input" id="name" name="name" placeholder="Username" />
      </div>
      <div className="form-group">
        Password<br/>
      <input type="password" id="password" name="password"/>
      </div>
    </div>
  )
};

const Register = () => {
  return(
    <div>
      <div className="form-group">
        Name<br/>
      <input className="text-input" id="user_name" name="name" placeholder="Username"/>
      </div>
      <div className="form-group">
        Email<br/>
      <input className="text-input" id="email" name="email" placeholder="Email"/>
      </div>
      <div className="form-group">
        Password<br/>
      <input type="password" id="password" name="password" />
        <p id="passwordHelpBlock" className="form-text text-muted">
          Your password must be 7 characters long, contain letters,numbers and special characters.
        </p>
      </div>
      <div className="form-group">
        Password Confirmation<br/>
      <input type="password" id="password_confirmation" name="password_confirmation" />
      </div>
    </div>
  );
}

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        token: ""
 	   };
  }

  create_user()
  {
    let usName = $('#user_name').val();
    let pass = $('#password').val();
    let passC = $('#password_confirmation').val();
    let email = $('#email').val();
    let text = JSON.stringify({
          user: {
            name: usName,
            password: pass,
            password_confirmation: passC,
            email: email,
            win_percent: 50,
          }
    });
    if (pass == passC)
    {
      $.ajax("/api/v1/users", {
      method: "POST",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: text,
      success: () => {
              alert("Profile Created. Please Login With Your Credentials.")
        },
        error: (textStatus, errorThrown) => {
          alert(errorThrown + "! Please Check the input field. No field should be blank.");
        },
      });
    }
  }

  submit_login(name, pass) {
    let data = {
        name: name,
        password: pass,
    }
    $.ajax("/api/v1/session", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(data),
      success: (resp) => {
          this.setState(_.extend(this.state, { token: resp }));
        },
      error:(resp) => {
        this.resetToken();
      }
    });
  }

  resetToken()
  {
    this.setState(_.extend(this.state, { token: "invalid" }));
  }


  render() {
    return (
      <Router>
        <div>
          {/* Login */}
          <Route path="/" exact={true} render={() =>
             <div>
               <div>
                 <h1>Login</h1>
               </div>
               <Login />
               <div className="form-group">
                 <Link to="/landing" className="btn btn-primary" onClick={() => this.submit_login($('#name').val(), $('#password').val())}>Login</Link>
               </div>
               <div>
                 New Users Register <Link to="/users/new">here</Link>
               </div>
             </div>
           }/>

         {/* Registration */}
         <Route path="/users/new" render={() =>
           <div>
             <h1>New User</h1>
             <Register />
             <div className="form-group">
              <Link to="/" className="btn btn-primary" onClick={() => this.create_user()}>Register</Link>
             </div>
             <div>
               <Link to="/">Back</Link>
             </div>
           </div>
          }/>

        {/* Landing Page */}
        <Route path="/landing" render={() =>
            {
              if(this.state.token && this.state.token != "Invalid")
              {
                return(
                  <div>
                    Landing
                  </div>
                );
              }
              else if (this.state.token == "Invalid"){
                  return(
                    <div>
                      Invalid username and password.<br/>
                      Please Re-Login.<br/>
                    <Link to="/" onClick={() => this.resetToken()}>Back To HomePage</Link>
                    </div>
                  );
              }
              else {
                return (
                  <div>
                    Authenticating...Please Wait.<br/>
                    If you are stuck on this page for a long time( more than 2 minutes) then your session might have expired.<br/>
                    Please re-login.
                    <div>
                      <Link to="/" onClick={() => this.resetToken()}>Cancel</Link>
                    </div>
                  </div>
                );
              }
            }
          }/>

        </div>
      </Router>
    );
	}
}
