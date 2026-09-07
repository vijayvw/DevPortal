import { projectRepository } from '../projects/project.dynamodb.repository';
import { blogPostRepository } from '../blog/blog-post.dynamodb.repository';
import { caseStudyRepository } from '../case-studies/case-study.dynamodb.repository';
import { skillRepository } from '../skills/skill.dynamodb.repository';
import { technologyRepository } from '../technologies/technology.dynamodb.repository';
import { contactMessageRepository } from '../contact/contact-message.dynamodb.repository';

export class DashboardService {
  async getStats() {
    const [
      projects,
      blogs,
      caseStudies,
      skills,
      technologies,
      messages,
    ] = await Promise.all([
      projectRepository.findAll({}),
      blogPostRepository.findAll({}),
      caseStudyRepository.findAll({}),
      skillRepository.findAll({}),
      technologyRepository.findAll(),
      contactMessageRepository.findAll({}),
    ]);

    return {
      counts: {
        projects: projects.items.length,
        blogs: blogs.items.length,
        caseStudies: caseStudies.items.length,
        skills: skills.length,
        technologies: technologies.length,
        messages: messages.items.length,
      },
      recent: {
        projects: projects.items.slice(0, 5),
        blogs: blogs.items.slice(0, 5),
        caseStudies: caseStudies.items.slice(0, 5),
        messages: messages.items.slice(0, 5),
      },
    };
  }
}

export const dashboardService =
  new DashboardService();
