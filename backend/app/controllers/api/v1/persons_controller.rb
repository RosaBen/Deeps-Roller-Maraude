class Api::V1::PersonsController < ApplicationController
  before_action :set_person, only: [:show, :update, :destroy]
  
  # GET /api/v1/persons
  def index
    @persons = Person.all.recent
    render json: @persons, status: :ok
  end

  # GET /api/v1/persons/1
  def show
    render json: @person, status: :ok
  end

  # POST /api/v1/persons
  def create
    @person = Person.new(person_params)
    
    if @person.save
      render json: @person, status: :created
    else
      render json: { errors: @person.errors }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/persons/1
  def update
    if @person.update(person_params)
      render json: @person, status: :ok
    else
      render json: { errors: @person.errors }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/persons/1
  def destroy
    @person.destroy
    head :no_content
  end

  private

  def set_person
    @person = Person.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Personne non trouvée' }, status: :not_found
  end

  def person_params
    params.require(:person).permit(
      :description, 
      :latitude, 
      :longitude, 
      :gender, 
      :age_category, 
      :date_encounter, 
      :location_visited
    )
  end
end
