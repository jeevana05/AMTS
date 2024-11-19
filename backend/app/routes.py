import random
import string
from datetime import datetime

import bcrypt
from flask import Blueprint, jsonify, request

from .models import Admin, Schedule, Station, Ticket, TicketLog, Train, db

# Define blueprints
admin_bp = Blueprint('admin', __name__)
passenger_bp = Blueprint('passenger', __name__)
station_bp = Blueprint('station', __name__)
train_bp = Blueprint('train', __name__)
ticket_bp = Blueprint('ticket', __name__)
schedule_bp = Blueprint('schedule', __name__)
auth_bp = Blueprint('auth', __name__)  # Authentication blueprint for login

# Routes for Admin
@admin_bp.route('/', methods=['POST'])
def create_admin():
    data = request.get_json()
    try:
        # Hash the password before storing
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        new_admin = Admin(admin_id=data['admin_id'], role_name=data['role_name'], password=hashed_password.decode('utf-8'), email=data['email'], is_admin = True)
        db.session.add(new_admin)
        db.session.commit()
        return jsonify({"message": "Admin created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@admin_bp.route('/<int:admin_id>', methods=['GET'])
def get_admin(admin_id):
    admin = Admin.query.get_or_404(admin_id)
    return jsonify({"admin_id": admin.admin_id, "role_name": admin.role_name, "email":admin.email})

@admin_bp.route('/<int:admin_id>', methods=['DELETE'])
def delete_admin(admin_id):
    admin = Admin.query.get_or_404(admin_id)
    db.session.delete(admin)
    db.session.commit()
    return jsonify({"message": "Admin deleted successfully"})

# Login route for Admin
@auth_bp.route('/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    # Fetch the admin details from the database
    admin = Admin.query.filter_by(email=email).first()
    if not email:
        return jsonify({"error": "Invalid admin ID"}), 404

    # Verify the password using bcrypt
    if bcrypt.checkpw(password.encode('utf-8'), admin.password.encode('utf-8')):
        # If the password matches, return a success message or token (for more secure authentication)
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid password"}), 401

# # Routes for Passenger
# @passenger_bp.route('/', methods=['POST'])
# def create_passenger():
#     data = request.get_json()
#     try:
#         new_passenger = Passenger(passenger_id=data['passenger_id'], p_name=data['p_name'], 
#                                   mobile_no=data['mobile_no'], email=data['email'])
#         db.session.add(new_passenger)
#         db.session.commit()
#         return jsonify({"message": "Passenger created successfully"}), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 400

# @passenger_bp.route('/<string:passenger_id>', methods=['GET'])
# def get_passenger(passenger_id):
#     passenger = Passenger.query.get_or_404(passenger_id)
#     return jsonify({"passenger_id": passenger.passenger_id, "p_name": passenger.p_name,
#                     "mobile_no": passenger.mobile_no, "email": passenger.email})


# Routes for Station
@station_bp.route('/', methods=['POST'])
def create_station():
    data = request.get_json()
    try:
        new_station = Station(station_id=data['station_id'], station_name=data['station_name'], location=data['location'])
        db.session.add(new_station)
        db.session.commit()
        return jsonify({"message": "Station created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@station_bp.route('/<string:station_id>', methods=['GET'])
def get_station(station_id):
    station = Station.query.get_or_404(station_id)
    return jsonify({"station_id": station.station_id, "station_name": station.station_name,
                    "location": station.location})


# Routes for Train
@train_bp.route('/', methods=['POST'])
def create_train():
    data = request.get_json()
    try:
        new_train = Train(train_no=data['train_no'], train_name=data['train_name'], 
                          src_station=data['src_station'], dest_station=data['dest_station'], 
                          duration=data['duration'], capacity=data['capacity'])
        db.session.add(new_train)
        db.session.commit()
        return jsonify({"message": "Train created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@train_bp.route('/<string:train_no>', methods=['GET'])
def get_train(train_no):
    train = Train.query.get_or_404(train_no)
    return jsonify({"train_no": train.train_no, "train_name": train.train_name,
                    "src_station": train.src_station, "dest_station": train.dest_station,
                    "duration": train.duration, "capacity": train.capacity})


# Routes for Tickets
from sqlalchemy import text


# Route to create a new ticket (Booking logic)
@ticket_bp.route('/book', methods=['POST'])
def create_ticket():
    data = request.get_json()

    try:
        # Extract necessary data from the request
        schedule_id = data.get('schedule_id')
        passenger_name= data.get('passenger_name')

        # Ensure required fields are provided
        if not schedule_id or not passenger_name:
            return jsonify({"error": "Missing required fields"}), 400

        # Fetch the schedule for the given schedule_id
        schedule = Schedule.query.filter_by(schedule_id=schedule_id).first()
        if not schedule:
            return jsonify({"error": "Schedule not found"}), 404

        # Assign default price based on the route
        price = 0
        if schedule.src_station == 'Jammalamadugu' and schedule.dest_station == 'Kadapa':
            price = 100  # Default price for JMD to KDP
        elif schedule.src_station == 'Kadapa' and schedule.dest_station == 'Jammalamadugu':
            price = 150  # Default price for KDP to JMD

        # Call the stored procedure to create a ticket
        result = db.session.execute(
            text("CALL create_ticket(:p_passenger_name, :p_train_no, :p_price, @p_ticket_id)"),
            {"p_passenger_name": passenger_name, "p_train_no": schedule.train_no, "p_price": price}
        )

        # Commit the session after the stored procedure execution
        db.session.commit()

        # Get the generated ticket ID from the procedure result
        result = db.session.execute(text("SELECT @p_ticket_id"))
        ticket_id = result.fetchone()[0]

        # Return a successful response with ticket details
        return jsonify({
            "message": "Ticket booked successfully",
            "ticket_id": ticket_id,
            "train_no": schedule.train_no,
            "price": price,
            "booking_time": datetime.utcnow()
        }), 201

    except Exception as e:
        db.session.rollback()  # Rollback in case of an error
        return jsonify({"error": f"Error: {str(e)}"}), 500


# @ticket_bp.route('/<string:ticket_id>', methods=['GET'])
# def get_ticket(ticket_id):
#     ticket = Ticket.query.get_or_404(ticket_id)
#     return jsonify({
#         "ticket_id": ticket.ticket_id,
#         "train_no": ticket.train_no,
#         "booking_time": ticket.booking_time,
#         "price": ticket.price
#     })

@ticket_bp.route('/<string:ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    # Query the Ticket table and join with the Train table to get the src_station and dest_station
    ticket = db.session.query(Ticket, Train.src_station, Train.dest_station).\
        join(Train, Train.train_no == Ticket.train_no).\
        filter(Ticket.ticket_id == ticket_id).first()

    # If ticket not found, return a 404 error
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404

    # Extract ticket and train details
    ticket_data = ticket[0]  # Ticket object
    src_station = ticket.src_station
    dest_station = ticket.dest_station

    # Return ticket details with src and dest stations
    return jsonify({
        "ticket_id": ticket_data.ticket_id,
        "train_no": ticket_data.train_no,
        "booking_time": ticket_data.booking_time,
        "price": ticket_data.price,
        "src_station": src_station,
        "dest_station": dest_station
    })


@ticket_bp.route('/cancel/<string:ticket_id>', methods=['DELETE'])
def cancel_ticket(ticket_id):
    ticket = Ticket.query.get_or_404(ticket_id) 
    try:
        db.session.delete(ticket)  # Delete the ticket
        db.session.commit() 
        return jsonify({"message": "Ticket canceled successfully"}), 200
    except Exception as e:
        db.session.rollback()  
        return jsonify({"error": str(e)}), 500


# Routes for Schedules
@schedule_bp.route('/', methods=['GET'])
def get_schedules():
    schedules = Schedule.query.all()
    result = []
    for schedule in schedules:
        result.append({
            "schedule_id": schedule.schedule_id,
            "train_no": schedule.train_no,
            "src_station": schedule.src_station,
            "dest_station": schedule.dest_station,
            "arrival_time": schedule.arrival_time.strftime("%H:%M:%S") if schedule.arrival_time else None,
            "departure_time": schedule.departure_time.strftime("%H:%M:%S") if schedule.departure_time else None,
            "frequency": schedule.frequency,
            "capacity": schedule.capacity
        })
    return jsonify(result)

# Backend route for fetching schedule data based on from and to stations
@schedule_bp.route('/booking', methods=['GET'])
def get_schedule():
    from_station = request.args.get('from_station')
    to_station = request.args.get('to_station')
    
    # Querying the Schedule table with src_station and dest_station fields
    schedules = Schedule.query.filter_by(src_station=from_station, dest_station=to_station).all()
    
    return jsonify([schedule.serialize() for schedule in schedules])



@schedule_bp.route('/update/<string:schedule_id>', methods=['PUT'])
def update_frequency(schedule_id):
    data = request.get_json()
    is_admin = data.get("is_admin", False)
    new_frequency = data.get("frequency")

    if not is_admin:
        return jsonify({"error": "Unauthorized action"}), 403

    schedule = Schedule.query.get(schedule_id)
    if not schedule:
        return jsonify({"error": "Schedule not found"}), 404

    try:
        schedule.frequency = new_frequency
        db.session.commit()
        return jsonify({"message": "Frequency updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Route to get ticket logs
@ticket_bp.route('/logs', methods=['GET'])
def get_ticket_logs():
    try:
        # Query the ticket_log table for all logs
        logs = db.session.query(TicketLog).all()
        # Format the logs as a JSON response
        log_data = [{
            "log_id": log.log_id,
            "ticket_id": log.ticket_id,
            "log_time": log.log_time,
            "action": log.action
        } for log in logs]
        return jsonify(log_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#aggregate query
@ticket_bp.route('/revenue', methods=['GET'])
def get_revenue():
    try:
        query = text("""
        SELECT train_no, COUNT(ticket_id) AS total_passengers, SUM(price) AS total_revenue
        FROM tickets
        GROUP BY train_no
        ORDER BY total_revenue DESC;
        """)
        result = db.session.execute(query)
        revenue_data = [
            {
                "train_no": row[0],
                "total_passengers": row[1],
                "total_revenue": row[2],
            }
            for row in result
        ]
        return jsonify(revenue_data), 200

    except Exception as e:
        print("Query Error:", str(e))
        return jsonify({"error": "Query failed", "details": str(e)}), 500
    


#nested query
@schedule_bp.route('/highest-frequency', methods=['GET'])
def get_highest_frequency_schedule():
    try:
        highest_frequency_schedule = db.session.execute(
            text("""
                SELECT train_no, frequency
                FROM schedules
                WHERE frequency = (
                    SELECT MAX(frequency)
                    FROM schedules
                    WHERE src_station = 'Kadapa' AND dest_station = 'Jammalamadugu'
                );
            """)
        ).fetchall()

        result = []
        for schedule in highest_frequency_schedule:
            result.append({
                'train_no': schedule.train_no,
                'frequency': schedule.frequency
            })

        return jsonify(result)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to fetch data'}), 500



