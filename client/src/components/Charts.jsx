import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export function HealthBarChart({ healthData }) {
  if (!healthData) return null;

  const data = [
    { name: 'Tasks', score: healthData.taskHealth?.score || 0, fill: '#4c805f' },
    { name: 'Deadlines', score: healthData.deadlineHealth?.score || 0, fill: '#b17c31' },
    { name: 'Issues', score: healthData.issueHealth?.score || 0, fill: '#b85d4c' },
    { name: 'Docs', score: healthData.documentationHealth?.score || 0, fill: '#5e88a6' },
    { name: 'Context', score: healthData.contextCompleteness?.score || 0, fill: '#846d97' }
  ];

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <XAxis dataKey="name" stroke="#738177" fontSize={11} tickLine={false} />
          <YAxis stroke="#738177" fontSize={11} domain={[0, 100]} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fbfcf8', borderColor: '#d8e0d8', borderRadius: '6px', color: '#24352d', fontSize: '12px' }}
            formatter={(value) => [`${value}%`, 'Health Score']}
          />
          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TaskDistributionPie({ completed = 0, pending = 0, blocked = 0 }) {
  const data = [
    { name: 'Completed', value: completed, color: '#4c805f' },
    { name: 'In Progress / Pending', value: pending, color: '#5e88a6' },
    { name: 'Blocked', value: blocked, color: '#b85d4c' }
  ].filter(d => d.value > 0);

  if (data.length === 0) {
    data.push({ name: 'No Tasks', value: 1, color: '#d8e0d8' });
  }

  return (
    <div className="w-full h-44 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={42}
            outerRadius={65}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#fbfcf8', borderColor: '#d8e0d8', borderRadius: '6px', color: '#24352d', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
