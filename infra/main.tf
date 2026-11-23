terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = "npipe:////.//pipe//docker_engine"
}

resource "docker_image" "app" {
  name         = var.image
  keep_locally = true
}

resource "docker_container" "web" {
  name  = var.container_name
  image = docker_image.app.image_id

  ports {
    internal = 3000
    external = 3000
  }
}
