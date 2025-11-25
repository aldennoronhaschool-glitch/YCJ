'use client';

import { useState, useEffect } from 'react';
import { ContactSubmission } from '@/lib/supabase/contact-submissions';
import { Mail, User, Phone, MapPin, Calendar, MessageSquare, Trash2, Eye, Archive, CheckCircle } from 'lucide-react';

export default function ContactSubmissionsPage() {
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, archived: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
    const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

    useEffect(() => {
        fetchSubmissions();
        fetchStats();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const response = await fetch('/api/admin/contact-submissions');
            if (response.ok) {
                const data = await response.json();
                setSubmissions(data);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/contact-submissions?stats=true');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const updateStatus = async (id: string, status: 'unread' | 'read' | 'archived') => {
        try {
            const response = await fetch('/api/admin/contact-submissions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });

            if (response.ok) {
                await fetchSubmissions();
                await fetchStats();
                if (selectedSubmission?.id === id) {
                    setSelectedSubmission({ ...selectedSubmission, status });
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const deleteSubmission = async (id: string) => {
        if (!confirm('Are you sure you want to delete this submission?')) return;

        try {
            const response = await fetch(`/api/admin/contact-submissions?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchSubmissions();
                await fetchStats();
                if (selectedSubmission?.id === id) {
                    setSelectedSubmission(null);
                }
            }
        } catch (error) {
            console.error('Error deleting submission:', error);
        }
    };

    const filteredSubmissions = submissions.filter(s =>
        filter === 'all' ? true : s.status === filter
    );

    const getConnectionLabel = (connection: string) => {
        const labels: Record<string, string> = {
            'member': 'Member/Volunteer',
            'attending': 'Attending Regularly',
            'online-other': 'Online + Other Church',
            'online-only': 'Online Only',
            'none': 'Not Attending',
        };
        return labels[connection] || connection;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bethel-red mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading submissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Submissions</h1>
                    <p className="text-gray-600">Manage messages from your website visitors</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <MessageSquare className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Unread</p>
                                <p className="text-2xl font-bold text-bethel-red">{stats.unread}</p>
                            </div>
                            <Mail className="w-8 h-8 text-bethel-red" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Read</p>
                                <p className="text-2xl font-bold text-green-600">{stats.read}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Archived</p>
                                <p className="text-2xl font-bold text-gray-500">{stats.archived}</p>
                            </div>
                            <Archive className="w-8 h-8 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="flex border-b">
                        {(['all', 'unread', 'read', 'archived'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-3 font-medium capitalize ${filter === f
                                        ? 'border-b-2 border-bethel-red text-bethel-red'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submissions List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* List */}
                    <div className="space-y-4">
                        {filteredSubmissions.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No submissions found</p>
                            </div>
                        ) : (
                            filteredSubmissions.map((submission) => (
                                <div
                                    key={submission.id}
                                    onClick={() => {
                                        setSelectedSubmission(submission);
                                        if (submission.status === 'unread') {
                                            updateStatus(submission.id, 'read');
                                        }
                                    }}
                                    className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all hover:shadow-lg ${selectedSubmission?.id === submission.id ? 'ring-2 ring-bethel-red' : ''
                                        } ${submission.status === 'unread' ? 'border-l-4 border-bethel-red' : ''}`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 mb-1">
                                                {submission.first_name} {submission.last_name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">{submission.message_title}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${submission.status === 'unread' ? 'bg-red-100 text-red-800' :
                                                submission.status === 'read' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {submission.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {new Date(submission.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Detail View */}
                    <div className="lg:sticky lg:top-4 lg:self-start">
                        {selectedSubmission ? (
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Submission Details</h2>
                                    <div className="flex gap-2">
                                        {selectedSubmission.status !== 'archived' && (
                                            <button
                                                onClick={() => updateStatus(selectedSubmission.id, 'archived')}
                                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                                                title="Archive"
                                            >
                                                <Archive className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteSubmission(selectedSubmission.id)}
                                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <User className="w-4 h-4" /> Name
                                        </label>
                                        <p className="text-gray-900 mt-1">
                                            {selectedSubmission.first_name} {selectedSubmission.last_name}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> Email
                                        </label>
                                        <a
                                            href={`mailto:${selectedSubmission.email}`}
                                            className="text-bethel-red hover:underline mt-1 block"
                                        >
                                            {selectedSubmission.email}
                                        </a>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <Phone className="w-4 h-4" /> Phone
                                        </label>
                                        <a
                                            href={`tel:+91${selectedSubmission.phone}`}
                                            className="text-bethel-red hover:underline mt-1 block"
                                        >
                                            +91 {selectedSubmission.phone}
                                        </a>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" /> City
                                        </label>
                                        <p className="text-gray-900 mt-1">{selectedSubmission.city}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Gender</label>
                                        <p className="text-gray-900 mt-1 capitalize">{selectedSubmission.gender}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Connection to Church</label>
                                        <p className="text-gray-900 mt-1">{getConnectionLabel(selectedSubmission.connection)}</p>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <label className="text-sm font-medium text-gray-600">Message Title</label>
                                        <p className="text-gray-900 mt-1 font-semibold">{selectedSubmission.message_title}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Message</label>
                                        <p className="text-gray-900 mt-1 whitespace-pre-wrap">{selectedSubmission.message_body}</p>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <label className="text-sm font-medium text-gray-600">Submitted</label>
                                        <p className="text-gray-900 mt-1">
                                            {new Date(selectedSubmission.created_at).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Select a submission to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
