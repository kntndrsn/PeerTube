import { Component, OnInit, inject } from '@angular/core'
import { AuthService, ConfirmService, Notifier, ScopedTokensService } from '@app/core'
import { VideoService } from '@app/shared/shared-main/video/video.service'
import { FeedFormat, ScopedToken } from '@peertube/peertube-models'
import { environment } from '../../../environments/environment'
import { InputTextComponent } from '../../shared/shared-forms/input-text.component'

@Component({
  selector: 'my-account-applications',
  templateUrl: './my-account-applications.component.html',
  styleUrls: [ './my-account-applications.component.scss' ],
  imports: [ InputTextComponent ]
})
export class MyAccountApplicationsComponent implements OnInit {
  private authService = inject(AuthService)
  private scopedTokensService = inject(ScopedTokensService)
  private videoService = inject(VideoService)
  private notifier = inject(Notifier)
  private confirmService = inject(ConfirmService)

  feedUrl: string
  feedToken: string

  private baseURL = environment.originServerUrl || window.location.origin

  ngOnInit () {
    this.feedUrl = this.baseURL

    this.scopedTokensService.getScopedTokens()
      .subscribe({
        next: tokens => this.regenApplications(tokens),

        error: err => this.notifier.error(err.message)
      })
  }

  async renewToken () {
    const res = await this.confirmService.confirm(
      // eslint-disable-next-line max-len
      $localize`Renewing the token will disallow previously configured clients from retrieving the feed until they use the new token. Proceed?`,
      $localize`Renew token`
    )
    if (res === false) return

    this.scopedTokensService.renewScopedTokens()
      .subscribe({
        next: tokens => {
          this.regenApplications(tokens)
          this.notifier.success($localize`Token renewed. Update your client configuration accordingly.`)
        },

        error: err => this.notifier.error(err.message)
      })
  }

  private regenApplications (tokens: ScopedToken) {
    const user = this.authService.getUser()
    const feeds = this.videoService.getVideoSubscriptionFeedUrls(user.account.id, tokens.feedToken)
    this.feedUrl = this.baseURL + feeds.find(f => f.format === FeedFormat.RSS).url
    this.feedToken = tokens.feedToken
  }
}
