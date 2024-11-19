import string
from datetime import datetime

from . import db


class Admin(db.Model):
    __tablename__ = 'admin'
    admin_id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(25), nullable=False)
    password = db.Column(db.String(60), unique=True)
    email = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=True) 

# class Passenger(db.Model):
#     __tablename__ = 'passenger'
#     passenger_id = db.Column(db.String(5), primary_key=True)
#     p_name = db.Column(db.String(25))
#     mobile_no = db.Column(db.Integer)
#     email = db.Column(db.String(40))

class Station(db.Model):
    __tablename__ = 'station'
    station_id = db.Column(db.String(5), primary_key=True)
    station_name = db.Column(db.String(45), unique=True, nullable=False)
    location = db.Column(db.String(45))

class Train(db.Model):
    __tablename__ = 'train'
    train_no = db.Column(db.String(5), primary_key=True)
    train_name = db.Column(db.String(45), nullable=False)
    src_station = db.Column(db.String(45), db.ForeignKey('station.station_name'), nullable=False)
    dest_station = db.Column(db.String(45), db.ForeignKey('station.station_name'), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)

class Ticket(db.Model):
    __tablename__ = 'tickets'
    ticket_id = db.Column(db.String(50), primary_key=True)
    train_no = db.Column(db.String(5), db.ForeignKey('train.train_no'))
    passenger_name = db.Column(db.String(60), nullable=False)
    booking_time = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    price = db.Column(db.Float)

class Schedule(db.Model):
    __tablename__ = 'schedules'
    
    schedule_id = db.Column(db.String(5), primary_key=True)
    train_no = db.Column(db.String(5), db.ForeignKey('train.train_no'), nullable=False)
    src_station = db.Column(db.String(45), nullable=False)
    dest_station = db.Column(db.String(45), nullable=False)
    arrival_time = db.Column(db.Time, nullable=False)
    departure_time = db.Column(db.Time, nullable=False)  
    frequency = db.Column(db.Integer, nullable=False)  
    capacity = db.Column(db.Integer, nullable=False)  

    def serialize(self):
        return {
            "schedule_id": self.schedule_id,
            "train_no": self.train_no,
            "src_station": self.src_station,
            "dest_station": self.dest_station,
            "arrival_time": str(self.arrival_time),
            "departure_time": str(self.departure_time),
            "frequency": self.frequency,
            "capacity":self.capacity
        }

class TicketLog(db.Model):
    __tablename__ = 'ticket_log'
    log_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ticket_id = db.Column(db.String(5), db.ForeignKey('tickets.ticket_id'))
    log_time = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())
    action = db.Column(db.String(20))
