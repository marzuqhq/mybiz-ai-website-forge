
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, Square, Download } from 'lucide-react';

interface TimeEntry {
  id: string;
  project: string;
  task: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  isActive: boolean;
}

const TimeTracker: React.FC = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [currentProject, setCurrentProject] = useState('');
  const [currentTask, setCurrentTask] = useState('');
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeEntry) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - activeEntry.startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeEntry]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!currentProject || !currentTask) return;

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      project: currentProject,
      task: currentTask,
      startTime: new Date(),
      duration: 0,
      isActive: true
    };

    setActiveEntry(newEntry);
    setElapsedTime(0);
  };

  const stopTimer = () => {
    if (!activeEntry) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - activeEntry.startTime.getTime()) / 1000);
    
    const completedEntry = {
      ...activeEntry,
      endTime,
      duration,
      isActive: false
    };

    setEntries(prev => [...prev, completedEntry]);
    setActiveEntry(null);
    setElapsedTime(0);
    setCurrentProject('');
    setCurrentTask('');
  };

  const getTotalTime = () => {
    return entries.reduce((total, entry) => total + entry.duration, 0);
  };

  const getProjectTotals = () => {
    const totals: { [key: string]: number } = {};
    entries.forEach(entry => {
      totals[entry.project] = (totals[entry.project] || 0) + entry.duration;
    });
    return totals;
  };

  const exportTimesheet = () => {
    let data = `Time Tracking Report
Generated: ${new Date().toLocaleDateString()}
Total Time Tracked: ${formatTime(getTotalTime())}

Detailed Entries:
Project\tTask\tStart Time\tEnd Time\tDuration
`;

    entries.forEach(entry => {
      data += `${entry.project}\t${entry.task}\t${entry.startTime.toLocaleString()}\t${entry.endTime?.toLocaleString() || 'In Progress'}\t${formatTime(entry.duration)}\n`;
    });

    data += `\nProject Totals:\n`;
    Object.entries(getProjectTotals()).forEach(([project, time]) => {
      data += `${project}: ${formatTime(time)}\n`;
    });

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timesheet.txt';
    a.click();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Time Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Controls */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project</label>
              <Input
                value={currentProject}
                onChange={(e) => setCurrentProject(e.target.value)}
                placeholder="Enter project name"
                disabled={!!activeEntry}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Task</label>
              <Input
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                placeholder="Enter task description"
                disabled={!!activeEntry}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-3xl font-mono font-bold">
              {formatTime(elapsedTime)}
            </div>
            <div className="flex gap-2">
              {!activeEntry ? (
                <Button 
                  onClick={startTimer}
                  disabled={!currentProject || !currentTask}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              ) : (
                <Button onClick={stopTimer} variant="destructive">
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              )}
            </div>
          </div>
          
          {activeEntry && (
            <div className="mt-4">
              <Badge variant="default">
                Active: {activeEntry.project} - {activeEntry.task}
              </Badge>
            </div>
          )}
        </div>

        {/* Summary Statistics */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Time</p>
            <p className="text-2xl font-bold text-blue-600">{formatTime(getTotalTime())}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Entries Today</p>
            <p className="text-2xl font-bold text-green-600">{entries.length}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Projects</p>
            <p className="text-2xl font-bold text-purple-600">{Object.keys(getProjectTotals()).length}</p>
          </div>
        </div>

        {/* Recent Entries */}
        {entries.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Recent Entries</h3>
              <Button onClick={exportTimesheet} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="space-y-2">
              {entries.slice(-5).reverse().map((entry) => (
                <div key={entry.id} className="flex justify-between items-center p-3 bg-white border rounded-lg">
                  <div>
                    <p className="font-medium">{entry.project}</p>
                    <p className="text-sm text-gray-600">{entry.task}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono">{formatTime(entry.duration)}</p>
                    <p className="text-xs text-gray-500">
                      {entry.startTime.toLocaleTimeString()} - {entry.endTime?.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Totals */}
        {Object.keys(getProjectTotals()).length > 0 && (
          <div>
            <h3 className="font-semibold mb-4">Project Totals</h3>
            <div className="space-y-2">
              {Object.entries(getProjectTotals()).map(([project, time]) => (
                <div key={project} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{project}</span>
                  <span className="font-mono">{formatTime(time)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeTracker;
