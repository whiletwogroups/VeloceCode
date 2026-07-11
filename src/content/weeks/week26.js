export const week26 = {
  "phase": 5,
  "week": 26,
  "title": "Docker Configurations (Level 2: Compose & Scaling)",
  "goal": "Expose multi-container configurations in docker-compose separating services.",
  "days": [
    {
      "day": "Mon",
      "learn": "Docker Compose container clusters configurations mapping networks parameters",
      "build": "Write docker-compose.yml file linking web database cache container services",
      "learnLinks": [
        {
          "label": "Docker Compose Specs",
          "url": "https://docs.docker.com/compose/compose-file/",
          "type": "doc"
        },
        {
          "label": "Docker Compose Walkthrough",
          "url": "https://www.youtube.com/watch?v=HG6yLdf-Jok",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Compose CLI reference",
          "url": "https://docs.docker.com/compose/reference/",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Tue",
      "learn": "Docker custom bridge networks container mappings properties endpoints",
      "build": "Configure private docker bridge interfaces routing database requests securely links",
      "learnLinks": [
        {
          "label": "Docker Networks driver guide",
          "url": "https://docs.docker.com/network/drivers/bridge/",
          "type": "doc"
        },
        {
          "label": "Docker Networks Video",
          "url": "https://www.youtube.com/watch?v=bKFMS5C4CG0",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Docker Network CLI config",
          "url": "https://docs.docker.com/network/#network-commands",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Wed",
      "learn": "Container runtime credentials loading env parameters variables injection files",
      "build": "Manage database connection parameters securely inside .env files loaded to containers",
      "learnLinks": [
        {
          "label": "Docker Compose env config",
          "url": "https://docs.docker.com/compose/environment-variables/set-environment-variables/",
          "type": "doc"
        },
        {
          "label": "Docker Env Injection Video",
          "url": "https://www.youtube.com/watch?v=3c-iBn73dDE",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Docker Compose Envs Guide",
          "url": "https://docs.docker.com/compose/how-tos/environment-variables/",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Thu",
      "learn": "Docker replicas scales configurations runtimes instances balance",
      "build": "Run scaling commands replica flags generating multiple web container processes logs",
      "learnLinks": [
        {
          "label": "Docker Scale CLI",
          "url": "https://docs.docker.com/reference/cli/docker/compose/up/",
          "type": "doc"
        },
        {
          "label": "Scaling Containers Video",
          "url": "https://www.youtube.com/watch?v=LCo_34Z_aYA",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Docker replicas setups",
          "url": "https://docs.docker.com/compose/how-tos/multiple-compose-files/",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Fri",
      "learn": "Production docker configurations logs checks daemon audits healthchecks",
      "build": "Add HEALTHCHECK directives inside docker-compose verify nodes systems operational health",
      "learnLinks": [
        {
          "label": "Dockerfile HEALTHCHECK",
          "url": "https://docs.docker.com/reference/dockerfile/#healthcheck",
          "type": "doc"
        },
        {
          "label": "Docker Healthchecks Video",
          "url": "https://www.youtube.com/watch?v=5rT1g6SgB-U",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Compose production checklists",
          "url": "https://docs.docker.com/compose/production/",
          "type": "doc"
        }
      ]
    }
  ]
};
