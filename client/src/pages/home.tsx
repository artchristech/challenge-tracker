import { useState, useEffect } from 'react';
import { ProfileButton } from '@/components/ProfileButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface Habit {
  name: string;
  completedDays: boolean[];
}

interface HabitTrackerState {
  habits: Habit[];
}

export default function Home() {
  const [habitTracker, setHabitTracker] = useState<HabitTrackerState>({
    habits: []
  });
  const [newHabitName, setNewHabitName] = useState('');

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habitTracker');
    if (savedHabits) {
      try {
        const parsed = JSON.parse(savedHabits);
        setHabitTracker(parsed);
      } catch (error) {
        console.error('Failed to parse saved habits:', error);
      }
    }
  }, []);

  // Save habits to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('habitTracker', JSON.stringify(habitTracker));
  }, [habitTracker]);

  const toggleDay = (habitIndex: number, dayIndex: number) => {
    setHabitTracker(prev => {
      const newHabits = [...prev.habits];
      const newCompletedDays = [...newHabits[habitIndex].completedDays];
      newCompletedDays[dayIndex] = !newCompletedDays[dayIndex];
      
      newHabits[habitIndex] = {
        ...newHabits[habitIndex],
        completedDays: newCompletedDays
      };

      return {
        habits: newHabits
      };
    });
  };

  const addHabit = () => {
    if (newHabitName.trim()) {
      setHabitTracker(prev => ({
        habits: [...prev.habits, {
          name: newHabitName.trim(),
          completedDays: Array(60).fill(false)
        }]
      }));
      setNewHabitName('');
    }
  };

  const removeHabit = (habitIndex: number) => {
    setHabitTracker(prev => ({
      habits: prev.habits.filter((_, index) => index !== habitIndex)
    }));
  };

  // Calculate overall progress across all habits
  const totalPossibleCompletions = habitTracker.habits.length * 60;
  const totalCompletions = habitTracker.habits.reduce((sum, habit) => 
    sum + habit.completedDays.filter(Boolean).length, 0
  );
  const overallProgressPercentage = totalPossibleCompletions > 0 
    ? Math.round((totalCompletions / totalPossibleCompletions) * 100) 
    : 0;

  // Helper function to get color intensity based on completion count for a day
  const getDayColorIntensity = (dayIndex: number) => {
    const completionsForDay = habitTracker.habits.reduce((count, habit) => 
      count + (habit.completedDays[dayIndex] ? 1 : 0), 0
    );
    const maxHabits = habitTracker.habits.length;
    
    if (completionsForDay === 0) return 'bg-gray-200';
    if (maxHabits === 0) return 'bg-gray-200';
    
    const intensity = completionsForDay / maxHabits;
    if (intensity <= 0.33) return 'bg-green-200';
    if (intensity <= 0.66) return 'bg-green-400';
    return 'bg-green-600';
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Habit Tracker</h1>
            <ProfileButton />
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Add New Habit Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Habit</h2>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter habit name (e.g., Workout, Read, Meditate)"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              className="flex-1"
            />
            <Button onClick={addHabit} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Habit
            </Button>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <div className="text-3xl font-bold text-primary">{totalCompletions}</div>
              <div className="text-muted-foreground text-sm">Total Completions</div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-3xl font-bold text-muted-foreground">{totalPossibleCompletions}</div>
              <div className="text-muted-foreground text-sm">Total Possible</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Overall Progress</span>
              <span>{overallProgressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${overallProgressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Habit Grid */}
        {habitTracker.habits.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">60-Day Habit Progress</h2>
            
            {/* Grid Layout */}
            <div className="overflow-x-auto">
              <div className="grid gap-1 mx-auto max-w-fit" style={{ 
                gridTemplateColumns: `auto repeat(60, minmax(20px, 1fr))`,
                gridTemplateRows: `auto repeat(${habitTracker.habits.length}, 24px)`
              }}>
                {/* Empty top-left cell */}
                <div></div>
                
                {/* Day headers (1-60) */}
                {Array.from({ length: 60 }, (_, dayIndex) => (
                  <div 
                    key={`day-header-${dayIndex + 1}`}
                    className="text-center text-xs text-muted-foreground font-medium flex items-center justify-center min-w-[20px]"
                  >
                    {dayIndex + 1}
                  </div>
                ))}

                {/* Habit rows */}
                {habitTracker.habits.map((habit, habitIndex) => [
                  /* Habit name label */
                  <div 
                    key={`label-${habit.name}-${habitIndex}`}
                    className="flex items-center text-xs text-muted-foreground font-medium pr-3 text-right justify-end min-w-[80px] truncate"
                  >
                    {habit.name}
                    <button
                      onClick={() => removeHabit(habitIndex)}
                      className="ml-2 text-red-400 hover:text-red-600 text-xs"
                      title="Remove habit"
                    >
                      ×
                    </button>
                  </div>,
                  
                  /* Day buttons for this habit */
                  ...Array.from({ length: 60 }, (_, dayIndex) => (
                    <button
                      key={`habit-${habitIndex}-day-${dayIndex}`}
                      onClick={() => toggleDay(habitIndex, dayIndex)}
                      className={`w-5 h-5 rounded cursor-pointer transition-colors duration-200 flex items-center justify-center text-xs font-medium ${
                        habit.completedDays[dayIndex]
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : `${getDayColorIntensity(dayIndex)} hover:bg-gray-300`
                      }`}
                    >
                    </button>
                  ))
                ]).flat()}
              </div>
            </div>
          </div>
        )}

        {/* Empty state when no habits */}
        {habitTracker.habits.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No habits yet!</h3>
            <p className="text-muted-foreground">Add your first habit above to start tracking your 60-day journey.</p>
          </div>
        )}


      </main>
    </div>
  );
}
