import React from 'react';
import { PROJECTS } from '../data';

interface ProjectsProps {
  milestones: Record<string, boolean>;
  onToggleMilestone: (projectId: string, index: number) => void;
}

export const Projects: React.FC<ProjectsProps> = ({
  milestones,
  onToggleMilestone,
}) => {
  return (
    <div className="view active" id="view-projects">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Projects</h1>
          <p>3 projects that get you hired. Depth beats breadth.</p>
        </div>
      </div>

      <div className="projects-grid">
        {PROJECTS.map((proj) => {
          // Count completed milestones
          const totalMilestones = proj.milestones.length;
          const milestonesDone = proj.milestones.filter(
            (_, idx) => !!milestones[`${proj.id}-${idx}`]
          ).length;
          
          const pct = Math.round((milestonesDone / totalMilestones) * 100);
          
          let statusLabel = 'Not Started';
          if (pct === 100) statusLabel = '✅ Complete';
          else if (pct > 0) statusLabel = `In Progress — ${pct}%`;

          // Format status color badge style
          const getStatusStyle = () => {
            if (pct === 0) {
              return { background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' };
            }
            if (pct === 100) {
              return {
                background: 'rgba(16,185,129,0.15)',
                color: 'var(--green)',
                border: '1px solid rgba(16,185,129,0.3)',
              };
            }
            // Parse hex color to rgb for background opacity
            const hex = proj.color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return {
              background: `rgba(${r},${g},${b},0.15)`,
              color: proj.color,
            };
          };

          return (
            <div key={proj.id} className="project-card">
              <div className="project-card-top">
                <div
                  className="project-number"
                  style={{
                    background: `linear-gradient(135deg, ${proj.color}33, ${proj.color}11)`,
                    color: proj.color,
                  }}
                >
                  {proj.number}
                </div>
                <div className="project-info">
                  <div
                    className="project-phase-badge"
                    style={{ background: `${proj.color}22`, color: proj.color }}
                  >
                    {proj.phase}
                  </div>
                  <div className="project-name">{proj.name}</div>
                  <div className="project-tagline">{proj.tagline}</div>
                </div>
                <div className="project-status-badge" style={getStatusStyle()}>
                  {statusLabel}
                </div>
              </div>

              <div className="project-body">
                <div className="project-weeks">⏱️ {proj.weeks}</div>
                <div className="project-tech">
                  {proj.tech.map((t) => (
                    <span key={t} className="tech-tag">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="project-milestones">
                  {proj.milestones.map((m, idx) => {
                    const isDone = !!milestones[`${proj.id}-${idx}`];
                    return (
                      <div
                        key={idx}
                        className="milestone-item"
                        onClick={() => onToggleMilestone(proj.id, idx)}
                      >
                        <div className={`milestone-check ${isDone ? 'done' : ''}`}></div>
                        <span className={`milestone-text ${isDone ? 'done' : ''}`}>{m}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="project-progress-footer">
                <div className="proj-progress-bar">
                  <div className="proj-progress-fill" style={{ width: `${pct}%`, background: proj.color }}></div>
                </div>
                <span className="proj-pct" style={{ color: proj.color }}>
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
