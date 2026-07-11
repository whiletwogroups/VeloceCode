export const week30 = {
  "phase": 5,
  "week": 30,
  "title": "Capstone Project — \"NexaAI\" (Phase 3 Production Deployment)",
  "goal": "Orchestrate multi-pod production-grade deployments utilizing Kubernetes clusters namespaces, and automate continuous delivery.",
  "days": [
    {
      "day": "Mon",
      "learn": "Production docker configurations, environments loading safeguards",
      "build": "Write multi-container configurations in docker-compose.prod.yml separating services",
      "learnLinks": [
        {
          "label": "Docker Compose production",
          "url": "https://docs.docker.com/compose/production/",
          "type": "doc"
        },
        {
          "label": "Deploying Docker Compose VPS",
          "url": "https://www.youtube.com/watch?v=LCo_34Z_aYA",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Tue",
      "learn": "Kubernetes Pod controllers configs, Services ingress paths",
      "build": "Write deployment.yml declarations for Next.js, Redis caches, and pgvector clusters namespaces",
      "learnLinks": [
        {
          "label": "Kubernetes Deployments specs",
          "url": "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
          "type": "doc"
        },
        {
          "label": "Kubernetes Deploy Walkthrough",
          "url": "https://www.youtube.com/watch?v=pYgWcZ7lqIE",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Wed",
      "learn": "Kubernetes environment secrets mapping, persistent volume claims configurations",
      "build": "Deploy database persistence maps and load application configuration maps to pods",
      "learnLinks": [
        {
          "label": "Kubernetes PVC guides",
          "url": "https://kubernetes.io/docs/concepts/storage/persistent-volumes/",
          "type": "doc"
        },
        {
          "label": "Kubernetes Volumes & ConfigMaps",
          "url": "https://www.youtube.com/watch?v=680v3g01Jhs",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Thu",
      "learn": "Continuous delivery deployment tools, automated cluster reloads (gh actions)",
      "build": "Write rolling update workflows triggering deployment reloads upon docker image builds pushes to GHCR",
      "learnLinks": [
        {
          "label": "Kubernetes rolling updates",
          "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/",
          "type": "doc"
        },
        {
          "label": "K8s CI/CD with GitActions",
          "url": "https://www.youtube.com/watch?v=38J9Zl2vQrs",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Fri",
      "learn": "Telemetry monitoring configurations, performance diagnostics dashboard audits",
      "build": "Connect Prometheus/Grafana metric panels, evaluate load responses, run final capstone demo audits",
      "learnLinks": [
        {
          "label": "Grafana dashboards configs",
          "url": "https://grafana.com/docs/grafana/latest/dashboards/",
          "type": "doc"
        },
        {
          "label": "Prometheus & Grafana Setup",
          "url": "https://www.youtube.com/watch?v=h4Sl21mgoM4",
          "type": "video"
        }
      ],
      "buildLinks": []
    }
  ],
  "deliverable": "Orchestrate multi-pod production-grade deployments utilizing Kubernetes clusters namespaces, and automate continuous delivery."
};
