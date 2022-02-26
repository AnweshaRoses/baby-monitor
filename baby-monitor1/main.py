from flask import Flask, render_template, request, url_for, redirect, flash, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, current_user, logout_user
from email_sender import Mailer
app = Flask(__name__)

app.config['SECRET_KEY'] = 'any-secret-key-you-choose'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER']='static/'
db = SQLAlchemy(app)


login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.filter_by(id=user_id).first()


##CREATE TABLE IN DB
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))
#Line below only required once, when creating DB. 
db.create_all()


@app.route('/')
def home():
    if(current_user.is_anonymous):
        return render_template("login.html")
    return render_template("dashboard.html")


@app.route('/register',methods=["GET","POST"])
def register():
    if request.method=="POST":
        if not User.query.filter_by(email=request.form["email"]).first():
            user=User(
                name=request.form["name"],
                email=request.form["email"],
                password=generate_password_hash(request.form["password"])
            )
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return redirect("/")
    return render_template("register.html",logged_in=not current_user.is_anonymous)


@app.route('/login',methods=["GET","POST"])
def login():
    if request.method=="POST":
        user=User.query.filter_by(email=request.form.get("email")).first()
        if user:
            if check_password_hash(user.password,request.form.get("password")):
                login_user(user)
                return redirect(f"/secrets?name={user.name}")
    return render_template("login.html",logged_in=not current_user.is_anonymous)

@login_required
@app.route('/monitor',methods=["GET","POST"])
def monitor():
    return render_template("monitor.html")

@login_required
@app.route('/faq')
def faq():
    return render_template("faq.html")

@login_required
@app.route('/about')
def about():
    return render_template("about.html")

@login_required
@app.route("/lullaby.mp3")
def get_music():
    return send_from_directory(
        app.config["UPLOAD_FOLDER"],"lullaby.mp3"
    )


@app.route("/baby-is-crying",methods=["GET","POST"])
@login_required
def babyHandler():
    if request.method=="POST":
        my_mailer=Mailer()
        my_mailer.mail(current_user.email)
        print(current_user.email)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)
