import { Component } from '@angular/core'
import { VideoCommentService } from '@app/shared/shared-video-comment/video-comment.service'
import { FeedFormat } from '@peertube/peertube-models'

import { VideoCommentListAdminOwnerComponent } from '../../../shared/shared-video-comment/video-comment-list-admin-owner.component'

@Component({
  selector: 'my-video-comment-list',
  templateUrl: './video-comment-list.component.html',
  imports: [
    VideoCommentListAdminOwnerComponent
  ]
})
export class VideoCommentListComponent {
  syndicationItems = [
    {
      format: FeedFormat.RSS,
      label: 'media rss 2.0',
      url: VideoCommentService.BASE_FEEDS_URL + FeedFormat.RSS.toLowerCase()
    },
    {
      format: FeedFormat.ATOM,
      label: 'atom 1.0',
      url: VideoCommentService.BASE_FEEDS_URL + FeedFormat.ATOM.toLowerCase()
    },
    {
      format: FeedFormat.JSON,
      label: 'json 1.0',
      url: VideoCommentService.BASE_FEEDS_URL + FeedFormat.JSON.toLowerCase()
    }
  ]
}
