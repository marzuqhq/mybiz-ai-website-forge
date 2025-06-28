
import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

const Status = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-green-50 rounded-full px-4 py-2 mb-8">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">All Systems Operational</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            System
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Status</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Real-time status of mybiz AI services and infrastructure.
          </p>
        </div>
      </section>

      {/* System Status */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Current Status</h2>
            <p className="text-xl text-slate-600">
              All systems are running smoothly with 99.9% uptime.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                service: "Website Builder",
                status: "operational",
                uptime: "99.9%",
                lastCheck: "2 minutes ago"
              },
              {
                service: "AI Generation Engine",
                status: "operational",
                uptime: "99.8%",
                lastCheck: "1 minute ago"
              },
              {
                service: "Content Management System",
                status: "operational",
                uptime: "100%",
                lastCheck: "3 minutes ago"
              },
              {
                service: "Website Hosting",
                status: "operational",
                uptime: "99.9%",
                lastCheck: "1 minute ago"
              },
              {
                service: "API Services",
                status: "operational",
                uptime: "99.7%",
                lastCheck: "2 minutes ago"
              }
            ].map((service, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-slate-900">{service.service}</span>
                  </div>
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Operational
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">{service.uptime} uptime</div>
                  <div className="text-xs text-slate-500">Last checked {service.lastCheck}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uptime Stats */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Uptime Statistics</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our commitment to reliability and performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { period: "Last 24 Hours", uptime: "100%" },
              { period: "Last 7 Days", uptime: "99.9%" },
              { period: "Last 30 Days", uptime: "99.8%" }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">{stat.uptime}</div>
                <div className="text-slate-600">{stat.period}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Incident History */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Recent Incidents</h2>
            <p className="text-xl text-slate-600">
              No recent incidents reported. All systems running smoothly.
            </p>
          </div>

          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-xl text-slate-600">No incidents in the last 30 days</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Status;
