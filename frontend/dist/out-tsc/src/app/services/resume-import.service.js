var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';
import { UpdatePersonalDetails, UpdateProfile, AddExperience, AddEducation, AddSkill, AddLanguage, AddCourse, AddCertificate } from '../state/resume-new.state';
// Configure PDF.js worker - use local file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.mjs';
let ResumeImportService = class ResumeImportService {
    constructor(store) {
        this.store = store;
    }
    async importFromFile(file) {
        console.log('📁 Importing file:', file.name, 'Type:', file.type);
        let text = '';
        try {
            // Parse file based on type
            if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                text = await this.parsePDF(file);
            }
            else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
                text = await this.parseDOCX(file);
            }
            else {
                // TXT or unknown text file
                text = await file.text();
            }
            console.log('✅ Extracted text length:', text.length);
            console.log('📝 First 500 characters:', text.substring(0, 500));
            // Parse and populate sections
            this.populateSections(text);
            console.log('🎉 Resume sections populated successfully!');
        }
        catch (error) {
            console.error('❌ Import error:', error);
            throw error;
        }
    }
    async parsePDF(file) {
        console.log('📄 Parsing PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // Use position info to detect line breaks
            let lastY = -1;
            let lastX = -1;
            let pageText = '';
            textContent.items.forEach((item) => {
                const currentY = item.transform[5]; // Y position
                const currentX = item.transform[4]; // X position
                // If Y position changed significantly, it's a new line
                // Use threshold of 2 to avoid splitting same-line text
                if (lastY !== -1 && Math.abs(currentY - lastY) > 2) {
                    pageText += '\n';
                    lastX = -1; // Reset X position for new line
                }
                else if (lastX !== -1 && currentX > lastX + 1) {
                    // Same line but with gap - add space
                    if (!pageText.endsWith(' ') && !pageText.endsWith('\n')) {
                        pageText += ' ';
                    }
                }
                pageText += item.str;
                lastY = currentY;
                lastX = currentX + (item.width || 0);
            });
            fullText += pageText + '\n';
        }
        console.log(`📄 Extracted ${pdf.numPages} pages from PDF`);
        return fullText;
    }
    async parseDOCX(file) {
        console.log('📄 Parsing DOCX...');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        console.log('📄 Extracted text from DOCX');
        return result.value;
    }
    populateSections(text) {
        console.log('🧩 Populating resume sections...text include', text);
        const lines = text.split(/\r?\n/).map(x => x.trim()).filter(x => x);
        console.log('🧩 Total non-empty lines:', lines);
        console.log('📊 Parsing resume with', lines.length, 'non-empty lines');
        // Extract personal details
        // Email: extract just the email address, not the whole line
        const emailLine = lines.find(l => l.includes('@')) || '';
        const emailMatch = emailLine.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        const email = emailMatch ? emailMatch[0] : '';
        // Phone: support multiple formats including parentheses
        // Patterns: (438)928-3288, 438-928-3288, 438.928.3288, 438 928 3288
        const phonePattern = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;
        const phoneLine = lines.find(l => phonePattern.test(l)) || '';
        const phoneMatch = phoneLine.match(phonePattern);
        const phone = phoneMatch ? phoneMatch[0] : '';
        // Name: take first few words from first line, handling cases where name might be split
        const nameLine = lines[0] || '';
        // Remove common noise like bullets, phones, emails from name line
        const cleanNameLine = nameLine.replace(/[•\-\*]/, '').replace(phonePattern, '').replace(/@.*/, '').trim();
        const nameParts = cleanNameLine.split(/\s+/).filter(p => p.length > 0);
        // Smart name parsing: if we have 2+ parts, first is given name, rest is family name
        const givenName = nameParts[0] || '';
        const familyName = nameParts.slice(1).join(' ') || '';
        console.log('👤 Personal Details found:', { givenName, familyName, email, phone });
        // Update Personal Details
        this.store.dispatch(new UpdatePersonalDetails({
            givenName,
            familyName,
            emailAddress: email,
            phoneNumber: phone
        }));
        // Helper function to check if a line is a section header
        // Section headers are standalone short lines, not part of sentences
        const isSectionHeader = (line, keywords) => {
            if (!line || line.length > 60)
                return false;
            if (!keywords.test(line))
                return false;
            // Avoid matching lines that start with lowercase or contain sentence patterns
            if (/^[a-z·]/.test(line))
                return false; // Starts with lowercase or bullet
            if (/\s(in|with|for|and|the|of|to)\s/i.test(line) && line.length > 30)
                return false; // Contains common sentence words
            return true;
        };
        // Define section header keywords
        const sectionKeywords = /(experience|education|skills|work history|employment|professional experience|technical skills|competences|competencies|technologies|information technology|certifications|certificates|projects|languages|courses|training|awards|publications|references|volunteering|interests|hobbies)/i;
        // Helper to find next section header
        const findNextSectionIndex = (linesArray) => {
            return linesArray.findIndex(l => isSectionHeader(l, sectionKeywords));
        };
        // Profile/Summary section
        const profileKeywords = /summary|objective|profile|about/i;
        const profileIndex = lines.findIndex(l => isSectionHeader(l, profileKeywords));
        let profileContent = '';
        if (profileIndex !== -1) {
            // Extract lines until we hit another section header
            const remainingLines = lines.slice(profileIndex + 1);
            const nextSectionIndex = findNextSectionIndex(remainingLines);
            const endIndex = nextSectionIndex > 0 ? nextSectionIndex : Math.min(10, remainingLines.length);
            profileContent = remainingLines.slice(0, endIndex).join('\n');
        }
        else {
            // Fallback: try to extract from lines after contact info, but stop at first section header
            const candidateLines = lines.slice(3, 15);
            const nextSectionIndex = findNextSectionIndex(candidateLines);
            const endIndex = nextSectionIndex > 0 ? nextSectionIndex : Math.min(10, candidateLines.length);
            profileContent = candidateLines.slice(0, endIndex).join('\n');
        }
        console.log('📋 Profile content length:', profileContent.length);
        this.store.dispatch(new UpdateProfile({
            content: profileContent
        }));
        // Experience section - look for multiple entries
        const experienceKeywords = /experience|employment|work history|professional experience/i;
        const expIndex = lines.findIndex(l => isSectionHeader(l, experienceKeywords));
        console.log('🔍 Looking for experience section...', { expIndex, headerLine: expIndex !== -1 ? lines[expIndex] : 'NOT FOUND' });
        if (expIndex !== -1) {
            const expLines = lines.slice(expIndex + 1);
            const nextSectionIndex = findNextSectionIndex(expLines);
            const relevantLines = nextSectionIndex > 0 ? expLines.slice(0, nextSectionIndex) : expLines;
            console.log('💼 Experience section found at line', expIndex);
            console.log('💼 Processing experience lines:', relevantLines.length);
            console.log('💼 First 10 lines:', relevantLines.slice(0, 10));
            // Rewritten job entry parsing - handle "Position Title Date" format
            // In this resume, each job title line contains: Company (optional) + Position + Date
            const positionKeywords = /\b(developer|engineer|manager|analyst|designer|specialist|coordinator|assistant|intern|internship|consultant|architect|lead|senior|junior|freelance|contractor)\b/i;
            const datePattern = /(19|20)\d{2}\.\d{2}~(19|20)\d{2}\.\d{2}|(19|20)\d{2}\.\d{2}~present/i;
            const jobEntries = [];
            let i = 0;
            while (i < relevantLines.length) {
                const line = relevantLines[i].trim();
                // Check if this line is a job title line: contains BOTH position keyword AND date
                const hasPosition = positionKeywords.test(line);
                const hasDate = datePattern.test(line);
                const isJobTitleLine = hasPosition && hasDate && line.length < 200 && !line.startsWith('·');
                if (isJobTitleLine) {
                    console.log('💼 Found job title line:', line);
                    // Extract the position and date from the line
                    const dateMatch = line.match(datePattern);
                    const dateStr = dateMatch ? dateMatch[0] : '';
                    // Remove date to get position+company part
                    const titlePart = line.replace(datePattern, '').trim();
                    // Try to split into company and position
                    // Common patterns:
                    // "Hitachi Systems Security Frontend developer"
                    // "Freelance Web Developer"
                    // "Kangaroo Rewards Full stack developer"
                    // "ADUX media PHP web developer(internship)"
                    let position = '';
                    let employer = '';
                    // Strategy: Find the position keyword and split there
                    const words = titlePart.split(/\s+/);
                    let positionStartIndex = -1;
                    // Look for the LAST occurrence of a position keyword
                    // Start from the end and work backwards
                    for (let w = words.length - 1; w >= 0; w--) {
                        const word = words[w].toLowerCase();
                        // Check if this word itself is a position keyword
                        if (positionKeywords.test(word)) {
                            // Now check backwards to find the start of the position phrase
                            // Include preceding adjectives like "Security Frontend", "Full stack", "PHP web"
                            let start = w;
                            // Look backwards for modifiers
                            while (start > 0) {
                                const prevWord = words[start - 1].toLowerCase();
                                // Common modifiers before position titles
                                if (/^(full|stack|senior|junior|lead|staff|principal|security|frontend|backend|front-end|back-end|full-stack|web|mobile|php|python|java|.net|react|angular|vue|software|hardware|data|cloud|devops|site|reliability)$/i.test(prevWord)) {
                                    start--;
                                }
                                else {
                                    break;
                                }
                            }
                            positionStartIndex = start;
                            break;
                        }
                    }
                    // Special case: "Full stack" without explicit position keyword after
                    if (positionStartIndex === -1) {
                        // Check if the line contains "full stack" or "fullstack"
                        const titleLower = titlePart.toLowerCase();
                        if (titleLower.includes('full stack') || titleLower.includes('fullstack')) {
                            // Find where "full" or "stack" appears
                            for (let w = 0; w < words.length; w++) {
                                if (/^(full|fullstack)$/i.test(words[w])) {
                                    positionStartIndex = w;
                                    break;
                                }
                            }
                        }
                    }
                    if (positionStartIndex > 0) {
                        // Company name is before position
                        employer = words.slice(0, positionStartIndex).join(' ').trim();
                        position = words.slice(positionStartIndex).join(' ').trim();
                    }
                    else if (positionStartIndex === 0) {
                        // Position starts at beginning, check if first word is a company indicator
                        if (/^(freelance)$/i.test(words[0])) {
                            employer = 'Freelance';
                            position = titlePart.trim();
                        }
                        else {
                            // Entire line is position
                            position = titlePart.trim();
                            employer = '';
                        }
                    }
                    else {
                        // No position keyword found, entire line is position
                        position = titlePart.trim();
                        employer = '';
                    }
                    // Collect description lines until we hit the next job title line
                    const descLines = [];
                    let j = i + 1;
                    while (j < relevantLines.length) {
                        const descLine = relevantLines[j].trim();
                        // Check if this is another job title line
                        const nextHasPosition = positionKeywords.test(descLine);
                        const nextHasDate = datePattern.test(descLine);
                        const isNextJobTitle = nextHasPosition && nextHasDate && descLine.length < 200 && !descLine.startsWith('·');
                        if (isNextJobTitle) {
                            break;
                        }
                        descLines.push(descLine);
                        j++;
                    }
                    const description = descLines.join('\n').trim();
                    // If employer is still empty, check if it's freelance
                    if (!employer) {
                        employer = position.toLowerCase().includes('freelance') ? 'Freelance' : 'N/A';
                    }
                    console.log(`💼 Job ${jobEntries.length + 1}:`, {
                        position: position.substring(0, 50),
                        employer: employer.substring(0, 50),
                        descLength: description.length,
                        date: dateStr
                    });
                    jobEntries.push({ position, employer, description });
                    // Move to next job
                    i = j;
                }
                else {
                    i++;
                }
            }
            console.log('💼 Total jobs found:', jobEntries.length);
            // Create an experience entry for each job
            if (jobEntries.length > 0) {
                jobEntries.forEach((job) => {
                    this.store.dispatch(new AddExperience({
                        position: job.position,
                        employer: job.employer,
                        description: job.description,
                        expanded: false
                    }));
                });
            }
            else {
                // Fallback: create one entry if parsing failed
                const position = relevantLines[0] || 'Position';
                const employer = relevantLines[1] || 'Company';
                const description = relevantLines.slice(2).join('\n');
                console.log('💼 Using fallback parsing');
                this.store.dispatch(new AddExperience({
                    position,
                    employer,
                    description,
                    expanded: false
                }));
            }
        }
        // Education section - handle multiple education entries
        const educationKeywords = /education|academic|degree/i;
        const eduIndex = lines.findIndex(l => isSectionHeader(l, educationKeywords));
        if (eduIndex !== -1) {
            const eduLines = lines.slice(eduIndex + 1);
            const nextSectionIndex = findNextSectionIndex(eduLines);
            const relevantLines = nextSectionIndex > 0 ? eduLines.slice(0, nextSectionIndex) : eduLines;
            console.log('🎓 Education section found, processing', relevantLines.length, 'lines');
            // Look for degree keywords that indicate start of a new entry
            const degreeKeywords = /\b(bachelor|master|phd|doctorate|diploma|certificate|degree|web technology|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?)\b/i;
            const schoolNamePatterns = /^(university|college|institute|school|academy)\s+(of|at|for)/i;
            const eduDatePattern = /(19|20)\d{2}\.\d{2}~(19|20)\d{2}\.\d{2}/i;
            const eduEntries = [];
            let i = 0;
            while (i < relevantLines.length) {
                const line = relevantLines[i].trim();
                // Check if this line starts a new education entry
                // Exclude lines that are obviously school names
                const isSchoolName = schoolNamePatterns.test(line);
                const hasDegreeKeyword = degreeKeywords.test(line);
                const isShortLine = line.length < 150 && line.length > 3;
                const notBulletPoint = !line.startsWith('·');
                if (hasDegreeKeyword && isShortLine && notBulletPoint && !isSchoolName) {
                    console.log('🎓 Found degree line:', line);
                    // This is a degree line
                    let degree = line.trim();
                    let school = '';
                    let description = '';
                    let j = i + 1;
                    // Next line might be school name or date line
                    if (j < relevantLines.length) {
                        const nextLine = relevantLines[j].trim();
                        // If next line has date, school might be on line after
                        if (eduDatePattern.test(nextLine)) {
                            j++;
                            if (j < relevantLines.length) {
                                school = relevantLines[j].trim();
                                j++;
                            }
                        }
                        else if (!degreeKeywords.test(nextLine) && !nextLine.startsWith('·')) {
                            // Next line is school
                            school = nextLine;
                            j++;
                        }
                    }
                    // Collect description until next degree entry
                    const descLines = [];
                    while (j < relevantLines.length) {
                        const descLine = relevantLines[j].trim();
                        const isNextDegree = degreeKeywords.test(descLine) &&
                            descLine.length < 150 &&
                            descLine.length > 3 &&
                            !descLine.startsWith('·');
                        if (isNextDegree) {
                            break;
                        }
                        descLines.push(descLine);
                        j++;
                    }
                    description = descLines.join('\n').trim();
                    console.log('🎓 Education entry:', { degree: degree.substring(0, 40), school: school.substring(0, 40), descLength: description.length });
                    eduEntries.push({ degree, school, description });
                    i = j;
                }
                else {
                    i++;
                }
            }
            console.log('🎓 Total education entries found:', eduEntries.length);
            // Create education entries
            if (eduEntries.length > 0) {
                eduEntries.forEach((edu) => {
                    this.store.dispatch(new AddEducation({
                        degree: edu.degree,
                        school: edu.school,
                        description: edu.description,
                        expanded: false
                    }));
                });
            }
            else {
                // Fallback: parse as single entry
                const degree = relevantLines[0] || 'Degree';
                const school = relevantLines[1] || 'School';
                const description = relevantLines.slice(2).join('\n');
                console.log('🎓 Using fallback parsing');
                this.store.dispatch(new AddEducation({
                    degree,
                    school,
                    description,
                    expanded: false
                }));
            }
        }
        // Skills section - create multiple skill entries
        const skillsKeywords = /skills|technical|competencies|competences|technologies|information technology/i;
        const skillsIndex = lines.findIndex(l => isSectionHeader(l, skillsKeywords));
        console.log('🔍 Looking for skills section...', { skillsIndex, headerLine: skillsIndex !== -1 ? lines[skillsIndex] : 'NOT FOUND' });
        if (skillsIndex !== -1) {
            const skillLines = lines.slice(skillsIndex + 1);
            const nextSectionIndex = findNextSectionIndex(skillLines);
            const relevantLines = nextSectionIndex > 0 ? skillLines.slice(0, nextSectionIndex) : skillLines;
            console.log('🔧 Skills section found at line', skillsIndex);
            console.log('🔧 Skills content lines:', relevantLines.length);
            console.log('🔧 First 5 skill lines:', relevantLines.slice(0, 5));
            // Create entries for each skill (up to 10)
            relevantLines.slice(0, 10).forEach((skillLine, index) => {
                if (skillLine.length > 0 && skillLine.length < 100) {
                    // Clean up the skill name
                    const skillName = skillLine.replace(/[•\-\*]/g, '').trim();
                    if (skillName) {
                        this.store.dispatch(new AddSkill({
                            skillName,
                            skillLevel: 'Intermediate', // Default level
                            expanded: false
                        }));
                    }
                }
            });
        }
        // Languages section
        const languagesKeywords = /languages|linguistic/i;
        const langIndex = lines.findIndex(l => isSectionHeader(l, languagesKeywords));
        if (langIndex !== -1) {
            const langLines = lines.slice(langIndex + 1);
            const nextSectionIndex = findNextSectionIndex(langLines);
            const relevantLines = nextSectionIndex > 0 ? langLines.slice(0, nextSectionIndex) : langLines.slice(0, 5);
            console.log('🗣️ Languages found:', relevantLines.length, 'potential languages');
            relevantLines.slice(0, 5).forEach((langLine) => {
                if (langLine.length > 0 && langLine.length < 50) {
                    const languageName = langLine.replace(/[•\-\*]/g, '').trim();
                    if (languageName) {
                        this.store.dispatch(new AddLanguage({
                            languageName,
                            languageLevel: 'Intermediate',
                            expanded: false
                        }));
                    }
                }
            });
        }
        // Courses section
        const coursesKeywords = /courses|training|workshops/i;
        const coursesIndex = lines.findIndex(l => isSectionHeader(l, coursesKeywords));
        if (coursesIndex !== -1) {
            const courseLines = lines.slice(coursesIndex + 1);
            const nextSectionIndex = findNextSectionIndex(courseLines);
            const relevantLines = nextSectionIndex > 0 ? courseLines.slice(0, nextSectionIndex) : courseLines.slice(0, 5);
            console.log('📚 Courses found:', relevantLines.length, 'potential courses');
            relevantLines.slice(0, 5).forEach((courseLine) => {
                if (courseLine.length > 0 && courseLine.length < 100) {
                    const courseName = courseLine.replace(/[•\-\*]/g, '').trim();
                    if (courseName) {
                        this.store.dispatch(new AddCourse({
                            courseName,
                            institution: '',
                            expanded: false
                        }));
                    }
                }
            });
        }
        // Certificates section
        const certificatesKeywords = /certifications|certificates|licenses/i;
        const certIndex = lines.findIndex(l => isSectionHeader(l, certificatesKeywords));
        if (certIndex !== -1) {
            const certLines = lines.slice(certIndex + 1);
            const nextSectionIndex = findNextSectionIndex(certLines);
            const relevantLines = nextSectionIndex > 0 ? certLines.slice(0, nextSectionIndex) : certLines.slice(0, 5);
            console.log('🏆 Certificates found:', relevantLines.length, 'potential certificates');
            relevantLines.slice(0, 5).forEach((certLine) => {
                if (certLine.length > 0 && certLine.length < 100) {
                    const certificateTitle = certLine.replace(/[•\-\*]/g, '').trim();
                    if (certificateTitle) {
                        this.store.dispatch(new AddCertificate({
                            certificateTitle,
                            issuer: '',
                            expanded: false
                        }));
                    }
                }
            });
        }
        console.log('✅ All sections dispatched to ResumeNewState');
    }
};
ResumeImportService = __decorate([
    Injectable({ providedIn: 'root' })
], ResumeImportService);
export { ResumeImportService };
//# sourceMappingURL=resume-import.service.js.map