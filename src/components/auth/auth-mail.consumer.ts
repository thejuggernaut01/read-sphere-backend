import {
  OnQueueEvent,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { QUEUE_NAME } from '../../common/constants/queue.constant';
import { MailService } from '../mail/mail.service';
import { Job } from 'bullmq';
import { IEmailJobData } from './types';
import { AUTH_JOB_NAMES } from './enum';

@Processor(QUEUE_NAME.AUTH)
export class AuthMailConsumer extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  @OnQueueEvent('added')
  onQueueAdded(job: Job) {
    console.log(`Processing job with ID ${job.id}...`);
  }

  @OnQueueEvent('failed')
  onQueueFailed(job: Job) {
    console.log(
      `Job with ID ${job.id} failed with error ${job.failedReason}...`,
    );
  }

  @OnQueueEvent('waiting')
  onQueueWaiting(job: Job) {
    console.log(`Job with ID ${job.id} is waiting...`);
  }

  @OnQueueEvent('completed')
  onQueueCompleted(job: Job) {
    console.log(`Job with ID ${job.id} completed`, job.returnvalue);
  }

  @OnWorkerEvent('error')
  onWorkerError(job: Job) {
    console.error(`Error processing email job: ${job.failedReason}`);
  }

  async process(job: Job<IEmailJobData, any, string>): Promise<any> {
    try {
      const { name, data } = job;
      const {
        subject,
        code,
        user: { email, firstName, lastName },
      } = data;

      switch (name) {
        case AUTH_JOB_NAMES.SEND_VERIFICATION_EMAIL: {
          await this.mailService.sendVerificationEmail(subject, code, {
            email,
            firstName,
            lastName,
          });

          console.log(`Verification email sent to ${email}`);
          break;
        }

        case AUTH_JOB_NAMES.SEND_WELCOME_EMAIL: {
          await this.mailService.sendWelcomeEmail(subject, {
            email,
            firstName,
            lastName,
          });

          console.log(`Welcome email sent to ${email}`);
          break;
        }

        case AUTH_JOB_NAMES.SEND_FORGOT_PASSWORD_EMAIL: {
          await this.mailService.sendForgotPasswordEmail(subject, code, {
            email,
            firstName,
            lastName,
          });

          console.log(`Forgot password verification email sent to ${email}`);
          break;
        }

        default:
          console.warn(`No processor for job: ${name}`);
          break;
      }
    } catch (error) {
      console.error(`Failed to process job ${job.name}`, error);
    }
  }
}
