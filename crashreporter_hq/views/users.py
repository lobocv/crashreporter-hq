
from flask import request, render_template, flash, redirect, url_for
import flask.ext.login as flask_login
from ..forms import CreateAliasForm
from ..models import User, Alias

from .. import app, db



@app.route('/users', methods=['GET'])
@flask_login.login_required
def users():
    if request.method == 'GET':
        uid = int(request.args.get('id', -1))
        if uid and flask_login.current_user.id == uid:
            # Show profile for the logged in user
            return redirect(url_for('user_profile'))
        elif uid < 0:
            if flask_login.current_user.admin:
                user_list = User.query.all()
                return render_template('users.html', user_list=user_list, user=flask_login.current_user)
            else:
                return 'User does not exist.'

        else:
            return 'Admin access only.'



@app.route('/users/profile', methods=['GET'])
@flask_login.login_required
def user_profile():

    if request.method == 'GET':
        form = CreateAliasForm()
        aliases = Alias.query.filter(Alias.user==flask_login.current_user).all()
        return render_template('user_profile.html', user=flask_login.current_user, form=form, aliases=aliases)



@app.route('/users/profile/create_alias', methods=['POST'])
@flask_login.login_required
def create_alias():
    form = CreateAliasForm()
    if form.validate_on_submit():
        alias = Alias(flask_login.current_user, form.data['alias'], form.data['uuid'])
        db.session.add(alias)
        db.session.commit()
        return redirect(request.referrer)
