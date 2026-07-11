export const week27 = {
  "phase": 5,
  "week": 27,
  "title": "Kubernetes Orchestration & Deployments",
  "goal": "Write deployment.yml declarations for Next.js, Redis caches, and pgvector clusters namespaces.",
  "days": [
    {
      "day": "Mon",
      "learn": "Kubernetes pod structures services mappings cluster configurations ingress targets",
      "build": "Set up local Minikube cluster namespaces verify nodes states configurations",
      "learnLinks": [
        {
          "label": "K8s core architectures",
          "url": "https://kubernetes.io/docs/concepts/architecture/",
          "type": "doc"
        },
        {
          "label": "Kubernetes Crash Course",
          "url": "https://www.youtube.com/watch?v=d6WC5n9G_sM",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Minikube start guides",
          "url": "https://minikube.sigs.k8s.io/docs/start/",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Tue",
      "learn": "Kubernetes deployment.yml configurations controller parameters replica settings",
      "build": "Write deployment.yml file mapping pod replica limits, service network targets",
      "learnLinks": [
        {
          "label": "K8s Deployments manifests",
          "url": "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
          "type": "doc"
        },
        {
          "label": "K8s Deployments Video",
          "url": "https://www.youtube.com/watch?v=pYgWcZ7lqIE",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "K8s Services specification",
          "url": "https://kubernetes.io/docs/concepts/services-networking/service/",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Wed",
      "learn": "Kubernetes storage maps, Persistent Volume Claims (PVC) configs",
      "build": "Deploy volume claims manifests PG database mounts directories configurations",
      "learnLinks": [
        {
          "label": "K8s Persistent Volumes",
          "url": "https://kubernetes.io/docs/concepts/storage/persistent-volumes/",
          "type": "doc"
        },
        {
          "label": "K8s Volumes Video",
          "url": "https://www.youtube.com/watch?v=680v3g01Jhs",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "K8s ConfigMaps specs",
          "url": "https://kubernetes.io/docs/concepts/configuration/configmap/",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Thu",
      "learn": "Kubernetes rolling updates deployment rollbacks strategies pod reloads",
      "build": "Trigger deployment updates updates, inspect rollouts status loops logs CLI",
      "learnLinks": [
        {
          "label": "K8s Rolling updates strategies",
          "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/",
          "type": "doc"
        },
        {
          "label": "K8s Rolling Updates Video",
          "url": "https://www.youtube.com/watch?v=38J9Zl2vQrs",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Kubectl rollout commands",
          "url": "https://kubernetes.io/docs/reference/kubectl/cheatsheet/#deployments",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Fri",
      "learn": "Telemetry monitoring dashboards frameworks setups (Prometheus Grafana)",
      "build": "Configure Prometheus Grafana metrics panels, compile pods load response audits",
      "learnLinks": [
        {
          "label": "Grafana telemetry configs",
          "url": "https://grafana.com/docs/grafana/latest/dashboards/",
          "type": "doc"
        },
        {
          "label": "Prometheus Grafana Video",
          "url": "https://www.youtube.com/watch?v=h4Sl21mgoM4",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "K8s metrics-server setup",
          "url": "https://github.com/kubernetes-sigs/metrics-server",
          "type": "doc"
        }
      ]
    }
  ]
};
