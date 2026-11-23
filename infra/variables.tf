variable "image" {
  description = "Docker image to run (built in exercise 2.1)"
  type        = string
  default     = "orders-api-api"
}

variable "container_name" {
  description = "Name of the container"
  type        = string
  default     = "orders-web"
}

variable "external_port" {
  description = "Port on your machine"
  type        = number
  default     = 8080
}