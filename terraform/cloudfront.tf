################################################################################
# CloudFront Distribution
################################################################################

# Origin Access Control for S3
resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "cornelcloud-oac"
  description                       = "OAC for cornelcloud.net S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Maps /projects/<slug> and /projects/<slug>/ to /projects/<slug>/index.html.
# S3 has no "directory index", so without this those URLs would 404 and fall
# back to the homepage, losing each project's own link-preview tags.
resource "aws_cloudfront_function" "project_pages" {
  name    = "cornelcloud-project-pages"
  runtime = "cloudfront-js-2.0"
  comment = "Serve /projects/<slug> from /projects/<slug>/index.html"
  publish = true
  code    = <<-EOT
    function handler(event) {
      var request = event.request;
      var uri = request.uri;
      if (uri.endsWith('/')) {
        request.uri = uri + 'index.html';
      } else if (uri.lastIndexOf('.') < uri.lastIndexOf('/')) {
        request.uri = uri + '/index.html';
      }
      return request;
    }
  EOT
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = [var.domain_name]
  comment             = "cornelcloud.net portfolio website"
  price_class         = "PriceClass_100" # US, Canada, Europe - cost effective

  # S3 Origin
  origin {
    domain_name              = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id                = "S3-${var.bucket_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
  }

  # Default cache behavior
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.bucket_name}"

    # Use managed cache policy for better performance
    cache_policy_id          = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized
    origin_request_policy_id = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf" # CORS-S3Origin

    # Adds HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy
    response_headers_policy_id = "67f7725c-6f97-4210-82d7-5512b31e9d03" # SecurityHeadersPolicy

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  # Project share pages: same origin and caching, plus the URI rewrite above.
  # Scoped to /projects/* so the function never runs for the rest of the site.
  ordered_cache_behavior {
    path_pattern     = "/projects/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.bucket_name}"

    cache_policy_id            = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized
    origin_request_policy_id   = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf" # CORS-S3Origin
    response_headers_policy_id = "67f7725c-6f97-4210-82d7-5512b31e9d03" # SecurityHeadersPolicy

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.project_pages.arn
    }
  }

  # Custom error responses for SPA support
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.website.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # No geo restrictions
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name = "cornelcloud.net Distribution"
  }
}
