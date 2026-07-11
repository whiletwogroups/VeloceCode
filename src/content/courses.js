import { PHASES as WEB_PHASES } from './phases.js';
import { WEEKS as WEB_WEEKS } from './weeks/index.js';

export const COURSES = [
  {
    id: 'webdev',
    title: 'Full-Stack Web Development',
    emoji: '🌐',
    color: '#6366f1',
    duration: '180 days',
    phasesCount: 6,
    level: 'Beginner → Advanced',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'PostgreSQL'],
    description: 'Go from absolute beginner to full-stack developer. Master the complete frontend, database, and CI deployment lifecycle.',
    available: true
  },
  {
    id: 'aiml',
    title: 'AI & Machine Learning Engineering',
    emoji: '🤖',
    color: '#8b5cf6',
    duration: '180 days',
    phasesCount: 6,
    level: 'Intermediate → Advanced',
    tags: ['Python', 'NumPy', 'PyTorch', 'LLMs', 'LangChain', 'RAG'],
    description: 'Master machine learning from statistical mechanics and math fundamentals to compiling context-aware AI APIs and agentic networks.',
    available: true
  },
  {
    id: 'datascience',
    title: 'Data Science & Analytics',
    emoji: '📊',
    color: '#06b6d4',
    duration: '150 days',
    phasesCount: 5,
    level: 'Beginner → Intermediate',
    tags: ['Python', 'Pandas', 'SQL', 'Scikit-learn', 'Tableau', 'Math'],
    description: 'Learn to clean, verify, and visualize data. Build production statistical models and translate datasets into actionable business analytics.',
    available: true
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Defenses',
    emoji: '🛡️',
    color: '#ef4444',
    duration: '150 days',
    phasesCount: 5,
    level: 'Beginner → Advanced',
    tags: ['Linux', 'Networking', 'OWASP', 'Kali Linux', 'Pen Testing'],
    description: 'Learn ethical hacking, penetration testing, defensive engineering, and server hardening. Prepare for industry-valued certifications.',
    available: true
  },
  {
    id: 'android',
    title: 'Android App Engineering',
    emoji: '📱',
    color: '#10b981',
    duration: '150 days',
    phasesCount: 5,
    level: 'Beginner → Advanced',
    tags: ['Kotlin', 'Jetpack Compose', 'MVVM', 'Room DB', 'Retrofit'],
    description: 'Build native high-performance mobile applications with Kotlin, clean architecture, Jetpack Compose UI, and background API caching.',
    available: true
  },
  {
    id: 'devops',
    title: 'DevOps & Site Reliability',
    emoji: '⚙️',
    color: '#f97316',
    duration: '150 days',
    phasesCount: 5,
    level: 'Intermediate → Advanced',
    tags: ['Docker', 'Kubernetes', 'AWS', 'Linux Shell', 'CI/CD Pipelines'],
    description: 'Master site reliability engineering. Compile robust deploy pipelines, manage cloud networks, configure container clusters, and automate rollouts.',
    available: true
  },
  {
    id: 'uiux',
    title: 'UI/UX Product Design',
    emoji: '🎨',
    color: '#ec4899',
    duration: '120 days',
    phasesCount: 4,
    level: 'Beginner → Advanced',
    tags: ['Figma', 'Wireframes', 'UX Research', 'Design Systems', 'Prototyping'],
    description: 'Master typography, user research, wireframing, and building production-grade Figma design systems that stand out.',
    available: true
  },
  {
    id: 'cloud',
    title: 'Cloud Architect Engineering',
    emoji: '☁️',
    color: '#0ea5e9',
    duration: '120 days',
    phasesCount: 4,
    level: 'Beginner → Advanced',
    tags: ['AWS', 'Azure', 'GCP', 'Serverless Systems', 'IAM Roles'],
    description: 'Design robust distributed networks in the cloud. Master system engineering concepts across AWS, Azure, and Google Cloud services.',
    available: true
  }
];

// Dynamically generate curriculum weeks/days if mock course is selected
export function getCourseCurriculum(courseId) {
  if (courseId === 'webdev') {
    return WEB_PHASES.map(p => ({
      ...p,
      weeks_data: WEB_WEEKS.filter(w => w.phase === p.phase)
    }));
  }

  // Find course meta
  const meta = COURSES.find(c => c.id === courseId) || COURSES[0];
  const phases = [];
  
  // Generate high-fidelity templates dynamically
  for (let pIdx = 1; pIdx <= meta.phasesCount; pIdx++) {
    const weeksCount = courseId === 'uiux' || courseId === 'cloud' ? 6 : pIdx === 3 ? 8 : 6;
    const startWeek = phases.reduce((acc, p) => acc + p.weeks_data.length, 0) + 1;
    const endWeek = startWeek + weeksCount - 1;
    const startDay = (startWeek - 1) * 5 + 1;
    const endDay = endWeek * 5;

    const weeksData = [];
    for (let wIdx = startWeek; wIdx <= endWeek; wIdx++) {
      const days = [];
      for (let d = 1; d <= 5; d++) {
        const globalDay = (wIdx - 1) * 5 + d;
        days.push({
          day: d,
          title: `Day ${globalDay}: Master ${meta.tags[(d - 1) % meta.tags.length]} Protocols`,
          learn: `Study core documentation and specifications for ${meta.tags[(d - 1) % meta.tags.length]} systems. Review architectural constraints.`,
          build: `Implement coding checklist, log git commits, and compile tests for ${meta.tags[d % meta.tags.length]} configurations.`
        });
      }

      weeksData.push({
        week: wIdx,
        phase: pIdx,
        title: `⚡ Week ${wIdx} — Advanced ${meta.tags[(wIdx - 1) % meta.tags.length]} Foundations`,
        summary: `Focus this week is understanding deep implementations of ${meta.tags[(wIdx - 1) % meta.tags.length]} structures and writing unit validations.`,
        days
      });
    }

    phases.push({
      phase: pIdx,
      title: `Phase ${pIdx}: Master ${meta.tags[(pIdx - 1) % meta.tags.length]} Layers`,
      subtitle: `${meta.tags[(pIdx - 1) % meta.tags.length]} + ${meta.tags[pIdx % meta.tags.length]} Architecture`,
      weeks: `Weeks ${startWeek}–${endWeek} · Days ${startDay}–${endDay}`,
      desc: `Deep dive into advanced configurations of ${meta.tags[(pIdx - 1) % meta.tags.length]}, deploying mock architectures, and mastering system security.`,
      weeks_data: weeksData
    });
  }

  return phases;
}
