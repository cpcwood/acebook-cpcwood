class UsersController < ApplicationController
  skip_before_action :require_login

  def show
    @users = User.where.not(id: 0).select('username, id')
    respond_to do |format|
      format.json do
        render json: @users.to_json
      end
    end
  end

  def new
    @user = User.new
    redirect_to(user_posts_path(user_id: session[:user_id]), notice: 'You cannot signup while logged in') if session[:user_id]
  end

  def create
    user_params = params.require(:user).permit(:email, :password, :profile_picture, :planet, :username)
    @user = User.new(user_params)
    begin
      @user.save!
      session[:user_id] = @user.id
      redirect_to(user_posts_path(user_id: @user.id), notice: "Congratulations #{@user['username']}, You Have Signed Up to wookiebook!")
    rescue ActiveRecord::RecordInvalid
      redirect_to('/signup', notice: @user.errors.messages.values[0].first)
    end
  end
end
