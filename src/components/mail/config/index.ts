import { createClient } from 'smtpexpress';
import { ENVIRONMENT } from '../../../common/config/environment';

const smtpexpressClient = createClient({
  projectId: ENVIRONMENT.SMTP.PROJECT_ID,
  projectSecret: ENVIRONMENT.SMTP.PROJECT_SECRETS,
});

export default smtpexpressClient;
