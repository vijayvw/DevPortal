locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  backend_source_files = concat(
    [
      for f in fileset("${path.module}/../backend/src", "**") :
      "${path.module}/../backend/src/${f}"
    ],
    [
      "${path.module}/../backend/package.json",
      "${path.module}/../backend/package-lock.json",
      "${path.module}/../backend/tsconfig.json"
    ]
  )

  backend_source_hash = sha256(
    join(
      "",
      [
        for f in sort(local.backend_source_files) :
        filesha256(f)
      ]
    )
  )

  frontend_source_files = concat(
    [
      for f in fileset("${path.module}/../frontend/src", "**") :
      "${path.module}/../frontend/src/${f}"
    ],
    [
      "${path.module}/../frontend/package.json",
      "${path.module}/../frontend/package-lock.json",
      "${path.module}/../frontend/tsconfig.json",
      "${path.module}/../frontend/vite.config.ts",
      "${path.module}/../frontend/index.html"
    ]
  )

  frontend_source_hash = sha256(
    join(
      "",
      [
        for f in sort(local.frontend_source_files) :
        filesha256(f)
      ]
    )
  )

  media_files = fileset(var.media_backup_path, "**")

  media_backup_hash = sha256(
    join(
      "",
      [
        for f in sort(local.media_files) :
        filesha256("${var.media_backup_path}/${f}")
      ]
    )
  )
}
