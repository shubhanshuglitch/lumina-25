require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Room = require('./models/Room');
const Event = require('./models/Event');
const Note = require('./models/Note');
const Booking = require('./models/Booking');
const CalendarEvent = require('./models/CalendarEvent');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB — seeding...');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}), Room.deleteMany({}), Event.deleteMany({}),
    Note.deleteMany({}), Booking.deleteMany({}), CalendarEvent.deleteMany({}),
  ]);

  // Create users
  const users = await User.create([
    {
      name: 'Aritra Roy', email: 'aritra@nexus.edu', password: 'password123',
      role: 'mentor', expertise: ['ML', 'Deep Learning', 'Computer Vision'],
      availability: 'Mon/Wed 6-8PM', bio: 'Senior at IIT, passionate about ML research.',
      college: 'IIT', year: '2024', avatarInitials: 'AR',
    },
    {
      name: 'Riya Nair', email: 'riya@nexus.edu', password: 'password123',
      role: 'mentor', expertise: ['Fullstack', 'React', 'Node.js'],
      availability: 'Tue/Thu 5-7PM', bio: 'Web dev mentor at NIT, loves open source.',
      college: 'NIT', year: '2023', avatarInitials: 'RN',
    },
    {
      name: 'Prof. Anand', email: 'anand@nexus.edu', password: 'password123',
      role: 'mentor', expertise: ['Systems', 'Distributed Systems', 'OS'],
      availability: 'Mon-Fri 10AM-12PM', bio: 'Faculty member, Systems & Distributed Computing.',
      college: 'IIT', year: 'Faculty', avatarInitials: 'PA',
    },
    {
      name: 'Amit Verma', email: 'amit@nexus.edu', password: 'password123',
      role: 'student', expertise: [], availability: '',
      bio: 'CS sophomore, learning full-stack development.',
      college: 'DTU', year: '2026', avatarInitials: 'AV',
    },
    {
      name: 'Priya Singh', email: 'priya@nexus.edu', password: 'password123',
      role: 'student', expertise: [], availability: '',
      bio: 'Data science enthusiast, 3rd year.',
      college: 'BITS', year: '2025', avatarInitials: 'PS',
    },
    {
      name: 'Admin User', email: 'admin@nexus.edu', password: 'password123',
      role: 'admin', expertise: [], availability: '',
      bio: 'Platform administrator.',
      college: '', year: '', avatarInitials: 'AD',
    },
  ]);

  const [aritra, riya, anand, amit, priya] = users;

  // Create rooms
  const rooms = await Room.create([
    {
      name: 'DSA Study Group', description: 'Discuss problem sets and mock interviews.',
      type: 'study', createdBy: aritra._id, members: [aritra._id, amit._id, priya._id],
    },
    {
      name: 'ML-Discuss', description: 'Machine Learning discussions and paper reviews.',
      type: 'mentorship', createdBy: aritra._id, members: [aritra._id, priya._id],
    },
    {
      name: 'Web-Projects', description: 'Collaborate on web development projects.',
      type: 'study', createdBy: riya._id, members: [riya._id, amit._id],
    },
    {
      name: 'Campus Hangout', description: 'Casual chat for campus community.',
      type: 'general', createdBy: amit._id, members: [amit._id, priya._id, aritra._id, riya._id],
    },
  ]);

  // Create events
  await Event.create([
    {
      title: 'Nexus 2025', description: 'Annual virtual hackathon. Build, learn, and compete with peers across campuses.',
      date: new Date('2025-11-06'), type: 'hackathon', status: 'in-progress',
      submittedBy: aritra._id, isApproved: true, location: 'Virtual',
    },
    {
      title: 'React Workshop', description: 'Hands-on React workshop covering hooks, state management, and deployment.',
      date: new Date('2025-11-15'), type: 'workshop', status: 'upcoming',
      submittedBy: riya._id, isApproved: true, location: 'Lab 201',
    },
    {
      title: 'ML Paper Reading Club', description: 'Weekly paper reading and discussion session.',
      date: new Date('2025-11-10'), type: 'club', status: 'upcoming',
      submittedBy: aritra._id, isApproved: true, location: 'Virtual',
    },
    {
      title: 'Open Source Meetup', description: 'Monthly meetup for open source contributors.',
      date: new Date('2025-11-20'), type: 'meetup', status: 'upcoming',
      submittedBy: riya._id, isApproved: true, location: 'Campus Auditorium',
    },
    {
      title: 'Systems Design Seminar', description: 'Prof. Anand covers distributed systems patterns.',
      date: new Date('2025-11-12'), type: 'workshop', status: 'upcoming',
      submittedBy: anand._id, isApproved: true, location: 'Lecture Hall 3',
    },
  ]);

  // Create sample notes (without actual files — they'll reference placeholder URLs)
  await Note.create([
    {
      title: 'DS Lecture 08', subject: 'Data Structures', description: '12 slides covering B-Trees and Red-Black Trees.',
      uploadedBy: anand._id, fileUrl: '/uploads/placeholder.pdf', fileName: 'DS_Lecture_08.pdf', fileType: 'application/pdf',
    },
    {
      title: 'ML Slides — Neural Networks', subject: 'Machine Learning', description: 'Introduction to neural networks and backpropagation.',
      uploadedBy: aritra._id, fileUrl: '/uploads/placeholder.pdf', fileName: 'ML_NeuralNets.pdf', fileType: 'application/pdf',
    },
    {
      title: 'Math Cheat Sheet', subject: 'Mathematics', description: 'Quick reference for linear algebra and calculus.',
      uploadedBy: priya._id, fileUrl: '/uploads/placeholder.pdf', fileName: 'Math_CheatSheet.pdf', fileType: 'application/pdf',
    },
    {
      title: 'OS Notes: Week 5', subject: 'Operating Systems', description: 'Process scheduling and deadlocks.',
      uploadedBy: anand._id, fileUrl: '/uploads/placeholder.pdf', fileName: 'OS_Week5.pdf', fileType: 'application/pdf',
    },
  ]);

  // Create sample bookings
  await Booking.create([
    {
      mentor: aritra._id, student: amit._id,
      timeslot: new Date('2025-11-08T18:00:00'), status: 'confirmed',
      notes: 'Want to discuss ML project ideas.',
    },
    {
      mentor: riya._id, student: priya._id,
      timeslot: new Date('2025-11-09T17:00:00'), status: 'pending',
      notes: 'Need help with React state management.',
    },
  ]);

  // Create sample calendar events
  await CalendarEvent.create([
    {
      user: amit._id, title: 'ML Office Hours',
      start: new Date('2025-11-08T16:00:00'), end: new Date('2025-11-08T17:00:00'),
      description: 'Attend ML office hours with Aritra', color: '#c46b4e',
    },
    {
      user: amit._id, title: 'React Workshop',
      start: new Date('2025-11-15T10:00:00'), end: new Date('2025-11-15T13:00:00'),
      description: 'React hooks workshop', color: '#2f7a6b',
    },
    {
      user: priya._id, title: 'Paper Reading',
      start: new Date('2025-11-10T14:00:00'), end: new Date('2025-11-10T15:30:00'),
      description: 'ML paper reading session', color: '#d8a23f',
    },
  ]);

  console.log('Seed complete! Created:');
  console.log('  - 6 users (3 mentors, 2 students, 1 admin)');
  console.log('  - 4 rooms');
  console.log('  - 5 events');
  console.log('  - 4 notes');
  console.log('  - 2 bookings');
  console.log('  - 3 calendar events');
  console.log('\nDemo login: amit@nexus.edu / password123');
  console.log('Mentor login: aritra@nexus.edu / password123');

  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
