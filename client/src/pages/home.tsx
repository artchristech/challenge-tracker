import { useState, useEffect } from 'react';
import { ProfileButton } from '@/components/ProfileButton';

interface WorkoutProgress {
  completedDays: boolean[];
  currentDay: number;
}

interface ReadingProgress {
  completedBooks: boolean[];
  currentBook: number;
}

export default function Home() {
  const [progress, setProgress] = useState<WorkoutProgress>({
    completedDays: Array(60).fill(false),
    currentDay: 1
  });

  const [readingProgress, setReadingProgress] = useState<ReadingProgress>({
    completedBooks: Array(12).fill(false),
    currentBook: 1
  });

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('workoutProgress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setProgress(parsed);
      } catch (error) {
        console.error('Failed to parse saved progress:', error);
      }
    }

    const savedReadingProgress = localStorage.getItem('readingProgress');
    if (savedReadingProgress) {
      try {
        const parsed = JSON.parse(savedReadingProgress);
        setReadingProgress(parsed);
      } catch (error) {
        console.error('Failed to parse saved reading progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('workoutProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('readingProgress', JSON.stringify(readingProgress));
  }, [readingProgress]);

  const toggleDay = (dayIndex: number) => {
    setProgress(prev => {
      const newCompletedDays = [...prev.completedDays];
      newCompletedDays[dayIndex] = !newCompletedDays[dayIndex];
      
      // Update current day to be the next incomplete day
      let newCurrentDay = 1;
      for (let i = 0; i < 60; i++) {
        if (!newCompletedDays[i]) {
          newCurrentDay = i + 1;
          break;
        }
        if (i === 59) {
          newCurrentDay = 60; // All days completed
        }
      }

      return {
        completedDays: newCompletedDays,
        currentDay: newCurrentDay
      };
    });
  };

  const resetProgress = () => {
    setProgress({
      completedDays: Array(60).fill(false),
      currentDay: 1
    });
  };

  const toggleBook = (bookIndex: number) => {
    setReadingProgress(prev => {
      const newCompletedBooks = [...prev.completedBooks];
      newCompletedBooks[bookIndex] = !newCompletedBooks[bookIndex];
      
      // Update current book to be the next incomplete book
      let newCurrentBook = 1;
      for (let i = 0; i < 12; i++) {
        if (!newCompletedBooks[i]) {
          newCurrentBook = i + 1;
          break;
        }
        if (i === 11) {
          newCurrentBook = 12; // All books completed
        }
      }

      return {
        completedBooks: newCompletedBooks,
        currentBook: newCurrentBook
      };
    });
  };

  const completedCount = progress.completedDays.filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / 60) * 100);
  
  const completedBooksCount = readingProgress.completedBooks.filter(Boolean).length;
  const readingProgressPercentage = Math.round((completedBooksCount / 12) * 100);

  // Create grid structure: 10 cycles of 6 days each
  const cycles = Array.from({ length: 10 }, (_, cycleIndex) => {
    const startDay = cycleIndex * 6;
    return {
      cycleNumber: cycleIndex + 1,
      days: Array.from({ length: 6 }, (_, dayIndex) => ({
        dayNumber: startDay + dayIndex + 1,
        completed: progress.completedDays[startDay + dayIndex]
      }))
    };
  });

  const workoutTypes = ["Push", "Pull", "Legs", "Arms", "Spa", "Cardio"];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Challenge Tracker</h1>
            <ProfileButton />
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Progress Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <div className="text-3xl font-bold text-primary">{completedCount}</div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-3xl font-bold text-muted-foreground">60</div>
              <div className="text-muted-foreground text-sm"></div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Workout Grid */}
        <div className="px-2">
          
          {/* Single CSS Grid Layout */}
          <div className="grid gap-1 mx-auto max-w-fit" style={{ 
            gridTemplateColumns: 'auto repeat(10, minmax(24px, 1fr))', 
            gridTemplateRows: 'auto repeat(6, 24px)',
            transform: 'translateX(-10px)'
          }}>
            {/* Empty top-left cell */}
            <div></div>
            
            {/* Week headers */}
            {cycles.map((cycle) => (
              <div 
                key={`header-${cycle.cycleNumber}`} 
                className="text-center text-xs text-muted-foreground font-medium flex items-center justify-center"
              >
                {cycle.cycleNumber}
              </div>
            ))}

            {/* Workout type rows */}
            {workoutTypes.map((workoutType, workoutIndex) => [
              /* Workout type label */
              <div 
                key={`label-${workoutType}`}
                className="flex items-center text-xs text-muted-foreground font-medium pr-3 text-right justify-end"
              >
                {workoutType}
              </div>,
              
              /* Day buttons for this workout type */
              ...cycles.map((cycle) => {
                const dayIndex = workoutIndex; // 0-5 for each workout type
                const day = cycle.days[dayIndex];
                return (
                  <button
                    key={`day-${day.dayNumber}`}
                    onClick={() => toggleDay(day.dayNumber - 1)}
                    className={`w-6 h-6 rounded cursor-pointer transition-colors duration-200 flex items-center justify-center text-xs font-medium ${
                      day.completed
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                  </button>
                );
              })
            ]).flat()}
          </div>

          
        </div>

        {/* Reading Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-foreground mb-2">Reading Challenge</h2>
              <div className="text-3xl font-bold text-primary">{completedBooksCount}</div>
              <div className="text-muted-foreground text-sm">books completed</div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-3xl font-bold text-muted-foreground">12</div>
              <div className="text-muted-foreground text-sm">total books</div>
            </div>
          </div>
          
          {/* Reading Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{readingProgressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${readingProgressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Reading Grid - Just X labels, no Y labels */}
          <div className="px-2">
            <div className="grid gap-1 mx-auto max-w-fit" style={{ 
              gridTemplateColumns: 'repeat(12, minmax(32px, 1fr))', 
              gridTemplateRows: 'auto 32px'
            }}>
              {/* Book number headers */}
              {Array.from({ length: 12 }, (_, index) => (
                <div 
                  key={`book-header-${index + 1}`} 
                  className="text-center text-xs text-muted-foreground font-medium flex items-center justify-center"
                >
                  {index + 1}
                </div>
              ))}
              
              {/* Book buttons */}
              {Array.from({ length: 12 }, (_, index) => (
                <button
                  key={`book-${index + 1}`}
                  onClick={() => toggleBook(index)}
                  className={`w-8 h-8 rounded cursor-pointer transition-colors duration-200 flex items-center justify-center text-xs font-medium ${
                    readingProgress.completedBooks[index]
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  📖
                </button>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
