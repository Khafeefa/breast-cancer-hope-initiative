import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function EventAnalytics() {
  const router = useRouter();
  const { id } = router.query;
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAnalytics();
    }
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/events/${id}/analytics`);
      const data = await response.json();
      setAnalytics(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!analytics) return;

    const csvData = [
      ['Metric', 'Value'],
      ['Event Name', analytics.eventName],
      ['Total Attendees', analytics.attendeeCount],
      ['Checked In', analytics.checkedInCount],
      ['Average Check-in Time', analytics.averageCheckInTime],
      ['Completion Rate', `${analytics.completionRate}%`],
      ['Registration Date', analytics.registrationDate],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-${id}-analytics.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-pink-600 text-xl">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-pink-600 text-xl">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <Head>
        <title>Event Analytics - Admin Dashboard</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-pink-600">Event Analytics</h1>
            <p className="text-gray-600 mt-2">{analytics.eventName}</p>
          </div>
          <button
            onClick={exportToCSV}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Export CSV
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Attendee Count Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Attendees</p>
                <p className="text-3xl font-bold text-pink-600 mt-2">{analytics.attendeeCount}</p>
              </div>
              <div className="bg-pink-100 rounded-full p-3">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Checked In Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-pink-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Checked In</p>
                <p className="text-3xl font-bold text-pink-600 mt-2">{analytics.checkedInCount}</p>
              </div>
              <div className="bg-pink-100 rounded-full p-3">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Average Check-in Time Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-pink-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg Check-in Time</p>
                <p className="text-3xl font-bold text-pink-600 mt-2">{analytics.averageCheckInTime}</p>
              </div>
              <div className="bg-pink-100 rounded-full p-3">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Completion Rate Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completion Rate</p>
                <p className="text-3xl font-bold text-pink-600 mt-2">{analytics.completionRate}%</p>
              </div>
              <div className="bg-pink-100 rounded-full p-3">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-pink-600 mb-6">Detailed Analytics</h2>
          
          {/* Progress Bar for Completion Rate */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Event Completion Progress</span>
              <span className="text-pink-600 font-semibold">{analytics.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-pink-400 to-pink-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${analytics.completionRate}%` }}
              ></div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-pink-500 pl-4">
              <p className="text-gray-600 text-sm">Registration Date</p>
              <p className="text-lg font-semibold text-gray-800">{analytics.registrationDate}</p>
            </div>
            <div className="border-l-4 border-pink-400 pl-4">
              <p className="text-gray-600 text-sm">Event Status</p>
              <p className="text-lg font-semibold text-gray-800">{analytics.status || 'Active'}</p>
            </div>
          </div>

          {/* Attendee List Preview */}
          {analytics.recentAttendees && analytics.recentAttendees.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-pink-600 mb-4">Recent Check-ins</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-pink-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Check-in Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.recentAttendees.map((attendee, index) => (
                      <tr key={index} className="hover:bg-pink-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendee.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{attendee.checkInTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                            {attendee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => router.push('/admin/events')}
            className="text-pink-600 hover:text-pink-700 font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Events
          </button>
        </div>
      </div>
    </div>
  );
}
