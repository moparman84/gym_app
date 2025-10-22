import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuthStore from '../store/useAuthStore';
import { format } from 'date-fns';
import EventModal from '../components/calendar/EventModal';
import LeaderboardModal from '../components/calendar/LeaderboardModal';
import WorkoutDetailModal from '../components/calendar/WorkoutDetailModal';
import DailyWorkoutView from '../components/calendar/DailyWorkoutView';
import AnnouncementsSection from '../components/calendar/AnnouncementsSection';
import { TrophyIcon, CalendarDaysIcon, ViewColumnsIcon } from '@heroicons/react/24/solid';

const CalendarPage = () => {
  const { user, userProfile } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [leaderboardEvent, setLeaderboardEvent] = useState(null);
  const [isWorkoutDetailOpen, setIsWorkoutDetailOpen] = useState(false);
  const [workoutDetailEvent, setWorkoutDetailEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'daily'
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch events from Firestore
  useEffect(() => {
    fetchEvents();
    fetchWorkouts();
  }, [user]);

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, 'events');
      // All users see all events (gym training schedule is public to all members)
      const querySnapshot = await getDocs(eventsRef);
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        start: doc.data().start,
        end: doc.data().end
      }));
      
      setEvents(eventsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const workoutsRef = collection(db, 'workouts');
      const querySnapshot = await getDocs(workoutsRef);
      const workoutsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWorkouts(workoutsData);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const handleDateClick = (arg) => {
    // Navigate to daily view for the clicked date
    const clickedDate = new Date(arg.dateStr + 'T00:00:00');
    setSelectedDate(clickedDate);
    setViewMode('daily');
  };

  const handleEventClick = (clickInfo) => {
    // Events are not clickable in calendar mode
    // Users should click on the date to view daily schedule
    return;
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (selectedEvent?.id) {
        // Update existing event
        const eventRef = doc(db, 'events', selectedEvent.id);
        await updateDoc(eventRef, eventData);
      } else {
        // Create new event
        await addDoc(collection(db, 'events'), {
          ...eventData,
          createdBy: user.uid,
          createdAt: new Date().toISOString(),
          mainLeaderboard: [],
          lockerWodLeaderboard: []
        });
      }
      
      fetchEvents();
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?.id) return;
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteDoc(doc(db, 'events', selectedEvent.id));
        fetchEvents();
        setIsModalOpen(false);
        setSelectedEvent(null);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Schedule</h1>
          <p className="mt-1 text-sm text-gray-500">
            {userProfile?.role === 'admin' 
              ? 'Schedule and manage gym classes and workout sessions'
              : 'View scheduled gym classes and workout sessions'}
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarDaysIcon className="h-5 w-5" />
            Calendar
          </button>
          <button
            onClick={() => setViewMode('daily')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'daily'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ViewColumnsIcon className="h-5 w-5" />
            Daily View
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              <TrophyIcon className="h-4 w-4 inline text-yellow-500" /> = Leaderboards available
            </p>
            <p className="text-xs text-gray-500">
              Click on a date to view workouts for that day
            </p>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events.map(event => ({
              ...event,
              title: (event.mainLeaderboard?.length > 0 || event.lockerWodLeaderboard?.length > 0) 
                ? `🏆 ${event.title}` 
                : event.title,
              display: 'block', // Display as block element
              classNames: ['non-interactive-event'] // Custom class for styling
            }))}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            editable={false}
            selectable={false}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            height="auto"
            eventInteractive={false}
          />
        </div>
      ) : (
        <DailyWorkoutView
          selectedDate={selectedDate}
          events={events}
          workouts={workouts}
          onDateChange={setSelectedDate}
          onEventClick={(event) => {
            if (userProfile?.role === 'admin') {
              setSelectedEvent(event);
              setIsModalOpen(true);
            } else {
              setWorkoutDetailEvent(event);
              setIsWorkoutDetailOpen(true);
            }
          }}
          onLeaderboardClick={(event) => {
            setLeaderboardEvent(event);
            setIsLeaderboardOpen(true);
          }}
          onCreateEvent={(date) => {
            // Create new event for selected date
            const dateStr = format(date, 'yyyy-MM-dd');
            setSelectedEvent({
              start: dateStr,
              end: dateStr,
              title: '',
              workoutId: '',
              assignedUsers: [user.uid]
            });
            setIsModalOpen(true);
          }}
          onEventsUpdate={fetchEvents}
          userProfile={userProfile}
        />
      )}

      {/* Announcements Section */}
      <div className="mt-8">
        <AnnouncementsSection userProfile={userProfile} />
      </div>

      {isModalOpen && (
        <EventModal
          event={selectedEvent}
          workouts={workouts}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onLeaderboard={() => {
            setLeaderboardEvent(selectedEvent);
            setIsLeaderboardOpen(true);
            setIsModalOpen(false);
          }}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}

      {isLeaderboardOpen && (
        <LeaderboardModal
          isOpen={isLeaderboardOpen}
          event={leaderboardEvent}
          userProfile={userProfile}
          onClose={() => {
            setIsLeaderboardOpen(false);
            setLeaderboardEvent(null);
            fetchEvents(); // Refresh events to show updated leaderboards
          }}
        />
      )}

      {isWorkoutDetailOpen && (
        <WorkoutDetailModal
          isOpen={isWorkoutDetailOpen}
          event={workoutDetailEvent}
          workout={workoutDetailEvent?.workoutId ? workouts.find(w => w.id === workoutDetailEvent.workoutId) : null}
          onViewLeaderboard={() => {
            setIsWorkoutDetailOpen(false);
            setLeaderboardEvent(workoutDetailEvent);
            setIsLeaderboardOpen(true);
          }}
          onClose={() => {
            setIsWorkoutDetailOpen(false);
            setWorkoutDetailEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default CalendarPage;
