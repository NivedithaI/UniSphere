import React, { useEffect, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Calendar, AlertCircle } from 'lucide-react';
import { LoadingState } from '../components/LoadingState';
import { useAuth } from '../app/context/AuthContext';
import { supabase } from '../lib/supabase';

interface CalendarEvent {
  id: string;
  title: string;
  event_date: string;
  category: string;
  description?: string;
}

export const AcademicCalendarPage: React.FC = () => {
  const { profile: authProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const loadCalendar = async () => {
      setLoading(true);
      setError(null);
      try {
        // Query academic_calendar table from Supabase
        const { data, error: dbErr } = await (supabase as any)
          .from('academic_calendar')
          .select('*')
          .order('event_date', { ascending: true });

        if (dbErr) {
          // Table may not exist yet — show empty state
          console.warn('Academic calendar query:', dbErr.message);
          setEvents([]);
        } else {
          setEvents(data || []);
        }
      } catch (err: any) {
        setError('Unable to load academic calendar. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCalendar();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <AppShell>
      <div className="page-header-container">
        <div>
          <div className="breadcrumbs">
            <span>Academics</span>
            <span className="breadcrumbs-separator">/</span>
            <span style={{ fontWeight: 600, color: 'var(--brand-black)' }}>Academic Calendar</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Academic Calendar</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--brand-dark-grey)', marginTop: '0.125rem' }}>
            Institutional schedule, examination dates, project deadlines, and holidays
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading academic calendar events..." />
      ) : error ? (
        <div className="dashboard-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <AlertCircle size={36} style={{ margin: '0 auto 0.75rem', color: '#EF4444' }} />
          <p style={{ fontWeight: 600, fontSize: '1rem', color: '#991B1B' }}>{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="dashboard-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <Calendar size={48} style={{ margin: '0 auto 1rem', color: '#94A3B8' }} />
          <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-black)' }}>
            No academic calendar events have been published yet.
          </h2>
          <p style={{ color: 'var(--brand-dark-grey)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Please check with your administration for upcoming academic events and important dates.
          </p>
        </div>
      ) : (
        <div className="card-box">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {events.map((ev) => (
              <div key={ev.id} className="timeline-item-card">
                <div className="event-date font-mono">{formatDate(ev.event_date)}</div>
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-black)' }}>{ev.title}</h4>
                  {ev.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--brand-dark-grey)', marginTop: '0.2rem' }}>{ev.description}</p>
                  )}
                  <span className="badge badge-secondary" style={{ marginTop: '0.25rem', fontSize: '0.7rem' }}>
                    {ev.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
};
export default AcademicCalendarPage;
