import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/audit`);

      const data = await response.json();

      if (data.success) {
        setLogs(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString('en-IN')}`;
  };

  const getResultStyle = (result) => {
    if (result === 'success') {
      return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-400';
    }

    if (result === 'failure') {
      return 'border-red-400/20 bg-red-400/10 text-red-400';
    }

    return 'border-yellow-400/20 bg-yellow-400/10 text-yellow-400';
  };

  const getActionIcon = (action = '') => {
    if (
      action.includes('payment') ||
      action.includes('checkout')
    ) {
      return '💳';
    }

    if (
      action.includes('approval') ||
      action.includes('ESCALATED')
    ) {
      return '🛡️';
    }

    if (action.includes('order')) {
      return '📦';
    }

    return '◈';
  };

  return (
    <div className="p-6 lg:p-10">

      {/* Header */}

      <div className="mb-8">

        <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
          Transparency Layer
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Audit Logs
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-gray-500">
          Complete trace of AI decisions, commerce actions and
          payment events performed by RazorAI.
        </p>

      </div>

      {/* Security Banner */}

      <div className="mb-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.03] p-6">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
            ◈
          </div>

          <div>

            <h2 className="font-semibold text-cyan-400">
              Immutable AI activity trail
            </h2>

            <p className="mt-2 text-xs leading-6 text-gray-600">
              Every important AI commerce decision is recorded with
              its actor, reasoning, transaction amount and outcome.
              This provides visibility into autonomous actions and
              safety escalations.
            </p>

          </div>

        </div>

      </div>

      {/* Stats */}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <p className="text-[10px] uppercase tracking-widest text-gray-600">
            Total Events
          </p>

          <p className="mt-3 text-3xl font-black">
            {loading ? '—' : logs.length}
          </p>

          <p className="mt-2 text-xs text-gray-600">
            Recorded commerce events
          </p>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <p className="text-[10px] uppercase tracking-widest text-gray-600">
            Successful
          </p>

          <p className="mt-3 text-3xl font-black text-emerald-400">
            {loading
              ? '—'
              : logs.filter(
                  (log) => log.result === 'success'
                ).length}
          </p>

          <p className="mt-2 text-xs text-gray-600">
            Successfully completed events
          </p>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <p className="text-[10px] uppercase tracking-widest text-gray-600">
            Escalations
          </p>

          <p className="mt-3 text-3xl font-black text-yellow-400">
            {loading
              ? '—'
              : logs.filter(
                  (log) =>
                    log.decisionType ===
                    'ESCALATED_HUMAN_APPROVAL'
                ).length}
          </p>

          <p className="mt-2 text-xs text-gray-600">
            AI safety interventions
          </p>

        </div>

      </div>

      {/* Logs */}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">

        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

          <div>

            <p className="text-[10px] uppercase tracking-widest text-gray-600">
              Event Stream
            </p>

            <h2 className="mt-1 text-lg font-bold">
              AI Audit Trail
            </h2>

          </div>

          <button
            onClick={fetchLogs}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            ↻ Refresh
          </button>

        </div>

        {loading ? (

          <div className="space-y-4 p-6">

            {[1, 2, 3, 4, 5].map((item) => (

              <div
                key={item}
                className="h-24 animate-pulse rounded-xl bg-white/5"
              />

            ))}

          </div>

        ) : logs.length === 0 ? (

          <div className="px-6 py-20 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl">
              ◈
            </div>

            <p className="mt-4 text-sm font-medium text-gray-400">
              No audit events found
            </p>

            <p className="mt-1 text-xs text-gray-700">
              AI activity will appear here.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-white/5">

            {logs.map((log) => (

              <div
                key={log._id}
                className="p-6 transition hover:bg-white/[0.025]"
              >

                <div className="flex gap-4">

                  {/* Icon */}

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg">
                    {getActionIcon(log.action)}
                  </div>

                  {/* Main */}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col justify-between gap-4 lg:flex-row">

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-sm font-semibold">
                            {log.action || 'Unknown Action'}
                          </h3>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[9px] uppercase ${getResultStyle(
                              log.result
                            )}`}
                          >
                            {log.result || 'unknown'}
                          </span>

                        </div>

                        <p className="mt-2 text-xs leading-5 text-gray-500">
                          {log.reason || 'No reason recorded.'}
                        </p>

                      </div>

                      <div className="shrink-0">

                        <p className="text-right text-lg font-black">
                          {log.amount
                            ? formatCurrency(log.amount)
                            : '—'}
                        </p>

                        <p className="mt-1 text-right text-[9px] text-gray-700">
                          {log.createdAt
                            ? new Date(
                                log.createdAt
                              ).toLocaleString('en-IN')
                            : 'Unknown time'}
                        </p>

                      </div>

                    </div>

                    {/* Metadata */}

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                      <div className="rounded-lg border border-white/5 bg-black/20 p-3">

                        <p className="text-[8px] uppercase tracking-widest text-gray-700">
                          Actor
                        </p>

                        <p className="mt-1 text-xs capitalize text-gray-400">
                          {log.actor || 'system'}
                        </p>

                      </div>

                      <div className="rounded-lg border border-white/5 bg-black/20 p-3">

                        <p className="text-[8px] uppercase tracking-widest text-gray-700">
                          Decision
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {log.decisionType
                            ? log.decisionType.replaceAll(
                                '_',
                                ' '
                              )
                            : '—'}
                        </p>

                      </div>

                      <div className="rounded-lg border border-white/5 bg-black/20 p-3">

                        <p className="text-[8px] uppercase tracking-widest text-gray-700">
                          Approval
                        </p>

                        <p className="mt-1 text-xs capitalize text-gray-400">
                          {log.approvalStatus || '—'}
                        </p>

                      </div>

                      <div className="rounded-lg border border-white/5 bg-black/20 p-3">

                        <p className="text-[8px] uppercase tracking-widest text-gray-700">
                          Order
                        </p>

                        <p className="mt-1 font-mono text-xs text-gray-400">
                          {log.relatedOrder
                            ? `#${String(
                                log.relatedOrder
                              ).slice(-8)}`
                            : '—'}
                        </p>

                      </div>

                    </div>

                    {/* Reasoning */}

                    {log.reasoningTrace && (

                      <details className="mt-4">

                        <summary className="cursor-pointer text-[10px] text-cyan-500 transition hover:text-cyan-400">
                          View AI reasoning trace
                        </summary>

                        <div className="mt-3 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.02] p-4">

                          <p className="text-xs leading-6 text-gray-500">
                            {log.reasoningTrace}
                          </p>

                        </div>

                      </details>

                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AuditLogs;