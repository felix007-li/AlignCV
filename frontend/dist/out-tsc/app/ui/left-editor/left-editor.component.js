var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, inject, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import Quill from 'quill';
// Configure Quill icons for alignment
const QuillIcons = Quill.import('ui/icons');
if (QuillIcons && QuillIcons['align']) {
    QuillIcons['align'][''] = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"></line><line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"></line><line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"></line></svg>';
    QuillIcons['align']['center'] = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line><line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"></line><line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"></line></svg>';
    QuillIcons['align']['right'] = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line><line class="ql-stroke" x1="15" x2="5" y1="14" y2="14"></line><line class="ql-stroke" x1="15" x2="9" y1="4" y2="4"></line></svg>';
    QuillIcons['align']['justify'] = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line><line class="ql-stroke" x1="15" x2="3" y1="14" y2="14"></line><line class="ql-stroke" x1="15" x2="3" y1="4" y2="4"></line></svg>';
}
import { ResumeNewState, UpdatePersonalDetails, UpdateProfile, AddExperience, UpdateExperience, DeleteExperience, ToggleExperienceExpanded, AddEducation, UpdateEducation, DeleteEducation, ToggleEducationExpanded, AddSkill, UpdateSkill, DeleteSkill, AddLanguage, UpdateLanguage, DeleteLanguage, AddCourse, UpdateCourse, DeleteCourse, AddCertificate, UpdateCertificate, DeleteCertificate, ToggleSectionCollapsed } from '../../state/resume-new.state';
import { ResumeImportService } from '../../services/resume-import.service';
let LeftEditorComponent = class LeftEditorComponent {
    constructor() {
        this.store = inject(Store);
        this.importService = inject(ResumeImportService);
        // Quill editor instances
        this.profileQuill = null;
        this.experienceQuills = new Map();
        this.educationQuills = new Map();
        // Track which editor is currently being edited (to prevent external updates)
        this.isEditingProfile = false;
        this.editingExperienceId = null;
        this.editingEducationId = null;
        this.personalDetails = {};
        this.profile = { content: '' };
        this.experiences = [];
        this.educations = [];
        this.skills = [];
        this.languages = [];
        this.courses = [];
        this.certificates = [];
        this.sectionsCollapsed = {
            experiences: false,
            educations: false,
            skills: false,
            languages: false,
            courses: false,
            certificates: false
        };
        this.profileCollapsed = false;
        this.loadingAI = signal(false);
        // Track which sections have AI suggestions visible
        this.aiSuggestionsVisible = {
            profile: false,
            experiences: {} // Will store by experience ID
        };
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.years = [];
    }
    ngOnInit() {
        // Generate years
        const currentYear = new Date().getFullYear();
        for (let year = currentYear + 10; year >= 1970; year--) {
            this.years.push(year);
        }
        // Subscribe to state
        this.store.select(ResumeNewState.personalDetails).subscribe(pd => this.personalDetails = pd);
        this.store.select(ResumeNewState.profile).subscribe(p => {
            this.profile = p;
            // Do NOT update Quill content here - it causes cursor to reset
            // Quill is initialized with content from state, then user edits trigger updates
        });
        this.store.select(ResumeNewState.experiences).subscribe(exp => {
            this.experiences = exp;
            // Do NOT update Quill content here - it causes cursor to reset
            // Quill is initialized with content from state, then user edits trigger updates
        });
        this.store.select(ResumeNewState.educations).subscribe(edu => {
            this.educations = edu;
            // Do NOT update Quill content here - it causes cursor to reset
            // Quill is initialized with content from state, then user edits trigger updates
        });
        this.store.select(ResumeNewState.skills).subscribe(s => this.skills = s);
        this.store.select(ResumeNewState.languages).subscribe(l => this.languages = l);
        this.store.select(ResumeNewState.courses).subscribe(c => this.courses = c);
        this.store.select(ResumeNewState.certificates).subscribe(cert => this.certificates = cert);
        this.store.select(ResumeNewState.sectionsCollapsed).subscribe(sc => this.sectionsCollapsed = sc);
    }
    ngAfterViewInit() {
        // Initialize Quill editors
        setTimeout(() => {
            this.initProfileQuill();
            this.initExperienceQuills();
            this.initEducationQuills();
        }, 100);
    }
    /**
     * Initialize Quill editor for profile section
     */
    initProfileQuill() {
        if (!this.profileEditorRef)
            return;
        // Create Quill instance
        this.profileQuill = new Quill(this.profileEditorRef.nativeElement, {
            theme: 'snow',
            placeholder: 'Write a compelling summary about yourself...',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'align': ['', 'center', 'right', 'justify'] }], // Alignment dropdown
                    ['link'],
                    ['clean']
                ]
            }
        });
        // Set initial content - do this BEFORE adding event listeners
        if (this.profile.content) {
            const htmlContent = this.convertTextToHtml(this.profile.content);
            // Use setContents instead of HTML to avoid issues
            const delta = this.profileQuill.clipboard.convert({ html: htmlContent });
            this.profileQuill.setContents(delta, 'silent'); // 'silent' prevents text-change event
        }
        // Listen for changes - but debounce to avoid excessive updates
        let updateTimeout;
        this.profileQuill.on('text-change', (delta, oldDelta, source) => {
            // Only skip updates from 'silent' (our own programmatic updates)
            if (source === 'silent') {
                return;
            }
            // Clear previous timeout
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }
            // Debounce updates
            updateTimeout = setTimeout(() => {
                const html = this.profileQuill.root.innerHTML;
                const plainText = this.profileQuill.getText().trim();
                this.profile.content = plainText ? html : '';
                this.updateProfile();
            }, 100);
        });
    }
    /**
     * Initialize Quill editors for experience sections that are already expanded
     */
    initExperienceQuills() {
        // Wait a bit more for DOM to render
        setTimeout(() => {
            this.experiences.forEach(exp => {
                if (exp.expanded && !this.experienceQuills.has(exp.id)) {
                    this.initExperienceQuill(exp.id);
                }
            });
        }, 200);
    }
    /**
     * Initialize Quill editors for education sections that are already expanded
     */
    initEducationQuills() {
        setTimeout(() => {
            this.educations.forEach(edu => {
                if (edu.expanded && !this.educationQuills.has(edu.id)) {
                    this.initEducationQuill(edu.id);
                }
            });
        }, 200);
    }
    /**
     * Initialize Quill editor for a specific education entry
     */
    initEducationQuill(eduId) {
        const editorElement = document.getElementById(`edu-editor-${eduId}`);
        if (!editorElement) {
            console.warn(`Education editor element not found for ID: edu-editor-${eduId}`);
            return;
        }
        const edu = this.educations.find(e => e.id === eduId);
        if (!edu) {
            console.warn(`Education not found for ID: ${eduId}`);
            return;
        }
        // Check if already initialized in our map with a valid instance
        const existingQuill = this.educationQuills.get(eduId);
        if (existingQuill) {
            // Check if the existing Quill's root element is still in the DOM
            if (document.body.contains(existingQuill.root)) {
                return;
            }
            else {
                this.educationQuills.delete(eduId);
            }
        }
        // Check if element already has a Quill instance from previous render
        const existingContainer = editorElement.querySelector('.ql-container');
        if (existingContainer) {
            editorElement.innerHTML = ''; // Clear stale Quill structure
        }
        // Create Quill instance
        const quill = new Quill(editorElement, {
            theme: 'snow',
            placeholder: 'Relevant courses, achievements, honors...',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'align': ['', 'center', 'right', 'justify'] }], // Alignment dropdown
                    ['link'],
                    ['clean']
                ]
            }
        });
        // Set initial content - do this BEFORE adding event listeners
        if (edu.description) {
            const htmlContent = this.convertTextToHtml(edu.description);
            // Use setText + formatting instead of HTML to avoid issues
            const delta = quill.clipboard.convert({ html: htmlContent });
            quill.setContents(delta, 'silent'); // 'silent' prevents text-change event
        }
        // Listen for changes - but debounce to avoid excessive updates
        let updateTimeout;
        quill.on('text-change', (delta, oldDelta, source) => {
            // Only skip updates from 'silent' (our own programmatic updates)
            if (source === 'silent') {
                return;
            }
            // Clear previous timeout
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }
            // Debounce updates
            updateTimeout = setTimeout(() => {
                const html = quill.root.innerHTML;
                const plainText = quill.getText().trim();
                const eduCurrent = this.educations.find(e => e.id === eduId);
                if (eduCurrent) {
                    eduCurrent.description = plainText ? html : '';
                    this.updateEdu(eduId);
                }
            }, 100);
        });
        // Store the instance
        this.educationQuills.set(eduId, quill);
    }
    updatePersonalDetails() {
        this.store.dispatch(new UpdatePersonalDetails(this.personalDetails));
    }
    updateProfile() {
        this.store.dispatch(new UpdateProfile(this.profile));
    }
    toggleSectionCollapse(section) {
        this.profileCollapsed = !this.profileCollapsed;
    }
    toggleSection(section) {
        this.store.dispatch(new ToggleSectionCollapsed(section));
    }
    // Experience methods
    addNewExperience() {
        this.store.dispatch(new AddExperience());
    }
    toggleExpEntry(id) {
        const exp = this.experiences.find(e => e.id === id);
        // If currently expanded, clean up Quill before collapsing
        if (exp && exp.expanded) {
            const quill = this.experienceQuills.get(id);
            if (quill) {
                this.experienceQuills.delete(id);
            }
        }
        this.store.dispatch(new ToggleExperienceExpanded(id));
        // Initialize Quill for this experience when expanding
        // Use longer timeout to ensure DOM is rendered
        setTimeout(() => {
            const expAfter = this.experiences.find(e => e.id === id);
            if (expAfter && expAfter.expanded) {
                this.initExperienceQuill(id);
            }
        }, 300);
    }
    /**
     * Initialize Quill editor for a specific experience
     */
    initExperienceQuill(expId) {
        const editorElement = document.getElementById(`exp-editor-${expId}`);
        if (!editorElement) {
            return;
        }
        const exp = this.experiences.find(e => e.id === expId);
        if (!exp) {
            return;
        }
        // Check if already initialized in our map with a valid instance
        const existingQuill = this.experienceQuills.get(expId);
        if (existingQuill) {
            // Check if the existing Quill's root element is still in the DOM
            if (document.body.contains(existingQuill.root)) {
                return;
            }
            else {
                this.experienceQuills.delete(expId);
            }
        }
        // Check if element already has a Quill instance from previous render
        const existingContainer = editorElement.querySelector('.ql-container');
        if (existingContainer) {
            editorElement.innerHTML = ''; // Clear stale Quill structure
        }
        // Create Quill instance
        const quill = new Quill(editorElement, {
            theme: 'snow',
            placeholder: 'Describe your responsibilities and achievements...',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'align': ['', 'center', 'right', 'justify'] }], // Alignment dropdown
                    ['link'],
                    ['clean']
                ]
            }
        });
        // Set initial content - do this BEFORE adding event listeners
        if (exp.description) {
            const htmlContent = this.convertTextToHtml(exp.description);
            // Use setContents instead of HTML to avoid issues
            const delta = quill.clipboard.convert({ html: htmlContent });
            quill.setContents(delta, 'silent'); // 'silent' prevents text-change event
        }
        // Listen for changes - but debounce to avoid excessive updates
        let updateTimeout;
        quill.on('text-change', (delta, oldDelta, source) => {
            // Only skip updates from 'silent' (our own programmatic updates)
            if (source === 'silent') {
                return;
            }
            // Clear previous timeout
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }
            // Debounce updates
            updateTimeout = setTimeout(() => {
                const html = quill.root.innerHTML;
                const plainText = quill.getText().trim();
                const expCurrent = this.experiences.find(e => e.id === expId);
                if (expCurrent) {
                    expCurrent.description = plainText ? html : '';
                    this.updateExp(expId);
                }
            }, 100); // 100ms debounce (faster response)
        });
        // Store the instance
        this.experienceQuills.set(expId, quill);
    }
    updateExp(id) {
        const exp = this.experiences.find(e => e.id === id);
        if (exp) {
            this.store.dispatch(new UpdateExperience(id, exp));
        }
    }
    deleteExp(id) {
        if (confirm('Delete this experience?')) {
            this.store.dispatch(new DeleteExperience(id));
        }
    }
    // Education methods
    addNewEducation() {
        this.store.dispatch(new AddEducation());
    }
    toggleEduEntry(id) {
        const edu = this.educations.find(e => e.id === id);
        // If currently expanded, clean up Quill before collapsing
        if (edu && edu.expanded) {
            const quill = this.educationQuills.get(id);
            if (quill) {
                this.educationQuills.delete(id);
            }
        }
        this.store.dispatch(new ToggleEducationExpanded(id));
        // Initialize Quill for this education when expanding
        // Use longer timeout to ensure DOM is rendered
        setTimeout(() => {
            const eduAfter = this.educations.find(e => e.id === id);
            if (eduAfter && eduAfter.expanded) {
                this.initEducationQuill(id);
            }
        }, 300);
    }
    updateEdu(id) {
        const edu = this.educations.find(e => e.id === id);
        if (edu) {
            this.store.dispatch(new UpdateEducation(id, edu));
        }
    }
    deleteEdu(id) {
        if (confirm('Delete this education entry?')) {
            this.store.dispatch(new DeleteEducation(id));
        }
    }
    // Skill methods
    addNewSkill() {
        this.store.dispatch(new AddSkill({ skillName: '', skillLevel: 'Intermediate' }));
    }
    updateSkill(id) {
        const skill = this.skills.find(s => s.id === id);
        if (skill) {
            this.store.dispatch(new UpdateSkill(id, skill));
        }
    }
    deleteSkill(id) {
        this.store.dispatch(new DeleteSkill(id));
    }
    // Language methods
    addNewLanguage() {
        this.store.dispatch(new AddLanguage({ languageName: '', languageLevel: 'Intermediate' }));
    }
    updateLanguage(id) {
        const lang = this.languages.find(l => l.id === id);
        if (lang) {
            this.store.dispatch(new UpdateLanguage(id, lang));
        }
    }
    deleteLanguage(id) {
        this.store.dispatch(new DeleteLanguage(id));
    }
    // Course methods
    addNewCourse() {
        this.store.dispatch(new AddCourse({ courseName: '', institution: '' }));
    }
    updateCourse(id) {
        const course = this.courses.find(c => c.id === id);
        if (course) {
            this.store.dispatch(new UpdateCourse(id, course));
        }
    }
    deleteCourse(id) {
        this.store.dispatch(new DeleteCourse(id));
    }
    // Certificate methods
    addNewCertificate() {
        this.store.dispatch(new AddCertificate({ certificateTitle: '', issuer: '' }));
    }
    updateCertificate(id) {
        const cert = this.certificates.find(c => c.id === id);
        if (cert) {
            this.store.dispatch(new UpdateCertificate(id, cert));
        }
    }
    deleteCertificate(id) {
        this.store.dispatch(new DeleteCertificate(id));
    }
    // AI Suggestions Toggle
    toggleProfileSuggestions() {
        if (this.aiSuggestionsVisible.profile) {
            // If already visible, toggle it off
            this.aiSuggestionsVisible.profile = false;
        }
        else {
            // If not visible, generate suggestions and show them
            if (!this.profile.suggestions || this.profile.suggestions.length === 0) {
                this.getSuggestionsForProfile();
            }
            this.aiSuggestionsVisible.profile = true;
        }
    }
    toggleExpSuggestions(id) {
        if (this.aiSuggestionsVisible.experiences[id]) {
            // If already visible, toggle it off
            this.aiSuggestionsVisible.experiences[id] = false;
        }
        else {
            // If not visible, generate suggestions if needed and show them
            const exp = this.experiences.find(e => e.id === id);
            if (exp && (!exp.suggestions || exp.suggestions.length === 0)) {
                this.getSuggestionsForExperience(id);
            }
            this.aiSuggestionsVisible.experiences[id] = true;
        }
    }
    async getSuggestionsForProfile() {
        this.loadingAI.set(true);
        try {
            const response = await fetch('http://localhost:3000/api/ai/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: this.profile.content || '',
                    locale: 'en',
                    title: 'Profile Summary',
                    description: this.profile.content || '',
                    keywords: [],
                    missing: [],
                    temperature: 1.2, // Higher temperature for more diversity (0.8-1.5 range)
                    seed: Math.floor(Math.random() * 1000000), // Random seed for different results each time
                    refresh: true, // Force bypass cache
                    filters: {
                        requireVerb: true,
                        requireNumber: false,
                        wordMin: 15,
                        wordMax: 50,
                        star: false,
                        injectMissingKeywords: false,
                        diversity: true // Request diverse suggestions
                    }
                })
            });
            if (response.ok) {
                const data = await response.json();
                console.log('AI Response:', data); // Debug log
                const suggestions = data.data?.suggestions?.map((s) => s.text) || [];
                this.store.dispatch(new UpdateProfile({ suggestions: suggestions.slice(0, 3) }));
                // Auto-show suggestions after fetching
                this.aiSuggestionsVisible.profile = true;
            }
            else {
                console.error('AI API error:', response.status, await response.text());
            }
        }
        catch (error) {
            console.error('Failed to get AI suggestions:', error);
        }
        finally {
            this.loadingAI.set(false);
        }
    }
    async getSuggestionsForExperience(id) {
        const exp = this.experiences.find(e => e.id === id);
        if (!exp)
            return;
        this.loadingAI.set(true);
        try {
            const response = await fetch('http://localhost:3000/api/ai/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: exp.description || '',
                    locale: 'en',
                    title: exp.position || 'Job Position',
                    description: exp.description || '',
                    keywords: [],
                    missing: [],
                    temperature: 1.2, // Higher temperature for more diversity (0.8-1.5 range)
                    seed: Math.floor(Math.random() * 1000000), // Random seed for different results
                    refresh: true, // Force bypass cache
                    filters: {
                        requireVerb: true,
                        requireNumber: true,
                        wordMin: 10,
                        wordMax: 30,
                        star: false,
                        diversity: true, // Request diverse suggestions
                        injectMissingKeywords: true
                    }
                })
            });
            if (response.ok) {
                const data = await response.json();
                console.log('AI Response:', data); // Debug log
                const suggestions = data.data?.suggestions?.map((s) => s.text) || [];
                this.store.dispatch(new UpdateExperience(id, { suggestions: suggestions.slice(0, 3) }));
                // Auto-show suggestions after fetching
                this.aiSuggestionsVisible.experiences[id] = true;
            }
            else {
                console.error('AI API error:', response.status, await response.text());
            }
        }
        catch (error) {
            console.error('Failed to get AI suggestions:', error);
        }
        finally {
            this.loadingAI.set(false);
        }
    }
    applyProfileSuggestion(suggestion) {
        const currentContent = this.profile.content || '';
        const newContent = currentContent ? `${currentContent}\n\n${suggestion}` : suggestion;
        this.store.dispatch(new UpdateProfile({ content: newContent }));
        // Analytics
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'ai_suggest_apply',
            section: 'profile',
            suggestionLength: suggestion.length
        });
    }
    applyExpSuggestion(id, suggestion) {
        const exp = this.experiences.find(e => e.id === id);
        if (!exp)
            return;
        const currentDesc = exp.description || '';
        const newDesc = currentDesc ? `${currentDesc}\n• ${suggestion}` : `• ${suggestion}`;
        this.store.dispatch(new UpdateExperience(id, { description: newDesc }));
        // Analytics
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'ai_suggest_apply',
            section: 'experience',
            suggestionLength: suggestion.length
        });
    }
    // Upload functionality
    async onUpload(event) {
        console.log('📤 Upload triggered');
        const input = event.target;
        const file = input.files?.[0];
        if (!file) {
            console.log('❌ No file selected');
            return;
        }
        console.log('📎 File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
        // File size validation (15MB max)
        if (file.size > 15 * 1024 * 1024) {
            alert('File size must be less than 15MB');
            return;
        }
        try {
            console.log('⏳ Starting import...');
            await this.importService.importFromFile(file);
            console.log('✅ Import completed successfully');
            // Analytics tracking
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'import_resume_success',
                source: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.docx') ? 'docx' : 'txt'
            });
            alert('Resume imported successfully!');
        }
        catch (error) {
            console.error('❌ Import failed:', error);
            alert('Failed to import resume. Please try again. Error: ' + error.message);
        }
        // Reset input
        input.value = '';
    }
    async importLinkedin() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf';
        input.onchange = async (e) => {
            const file = e.target.files?.[0];
            if (file) {
                try {
                    await this.importService.importFromFile(file);
                    // Analytics tracking
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        event: 'import_resume_success',
                        source: 'linkedin'
                    });
                    alert('LinkedIn profile imported successfully!');
                }
                catch (error) {
                    console.error('LinkedIn import failed:', error);
                    alert('Failed to import LinkedIn profile. Please try again.');
                }
            }
        };
        input.click();
    }
    trackById(index, item) {
        return item.id;
    }
    /**
     * Convert plain text to HTML for Quill
     * Handles text imported from resume files
     */
    convertTextToHtml(text) {
        if (!text)
            return '';
        // Check if already HTML (contains HTML tags)
        if (/<[a-z][\s\S]*>/i.test(text)) {
            return text;
        }
        // Convert plain text to HTML paragraphs
        const lines = text.split('\n');
        const htmlLines = lines.map(line => {
            const trimmed = line.trim();
            if (!trimmed)
                return '<p><br></p>'; // Empty line
            // Check for bullet points
            if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                return `<ul><li>${trimmed.substring(1).trim()}</li></ul>`;
            }
            // Check for numbered list
            if (/^\d+\./.test(trimmed)) {
                const content = trimmed.replace(/^\d+\.\s*/, '');
                return `<ol><li>${content}</li></ol>`;
            }
            // Regular paragraph
            return `<p>${trimmed}</p>`;
        });
        return htmlLines.join('');
    }
};
__decorate([
    ViewChild('profileEditor')
], LeftEditorComponent.prototype, "profileEditorRef", void 0);
LeftEditorComponent = __decorate([
    Component({
        standalone: true,
        selector: 'app-left-editor',
        imports: [CommonModule, FormsModule],
        encapsulation: ViewEncapsulation.None,
        template: `
    <div class="space-y-4">
      <!-- Upload & Import Buttons -->
      <div class="flex gap-2 mb-4">
        <label class="flex-1">
          <input
            type="file"
            class="hidden"
            accept=".pdf,.docx,.txt"
            (change)="onUpload($event)"
          />
          <span
            class="block border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 text-center cursor-pointer bg-white hover:bg-gray-50 hover:border-blue-400 transition-colors"
          >
            <svg class="w-6 h-6 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span class="text-sm font-medium text-gray-700">Upload existing resume</span>
            <span class="text-xs text-gray-500 block mt-1">PDF, DOCX or TXT</span>
          </span>
        </label>
        <button
          (click)="importLinkedin()"
          class="flex-1 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 bg-white hover:bg-gray-50 hover:border-blue-400 transition-colors"
        >
          <svg class="w-6 h-6 mx-auto mb-1 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
          <span class="text-sm font-medium text-gray-700">Import from LinkedIn</span>
          <span class="text-xs text-gray-500 block mt-1">Upload exported PDF</span>
        </button>
      </div>

      <!-- Personal Details Section (Always Expanded) -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-gray-400">::</span>
          <h3 class="text-lg font-semibold">Personal Details</h3>
        </div>

        <div class="space-y-3">
          <div class="grid grid-cols-3 gap-3">
            <!-- Photo Upload -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <input type="file" class="hidden" accept="image/*" />
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            <!-- Given Name and Family Name -->
            <div class="col-span-2 space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Given name</label>
                  <input
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    [(ngModel)]="personalDetails.givenName"
                    (ngModelChange)="updatePersonalDetails()"
                    placeholder=""
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Family name</label>
                  <input
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    [(ngModel)]="personalDetails.familyName"
                    (ngModelChange)="updatePersonalDetails()"
                    placeholder=""
                  />
                </div>
              </div>

              <!-- Desired Job Position -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <span>Desired job position</span>
                  <label class="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="hidden"
                      [(ngModel)]="personalDetails.useAsHeadline"
                      (ngModelChange)="updatePersonalDetails()"
                    />
                    <div class="relative">
                      <div class="w-10 h-5 bg-gray-300 rounded-full transition-colors" [class.bg-blue-600]="personalDetails.useAsHeadline"></div>
                      <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform" [class.translate-x-5]="personalDetails.useAsHeadline"></div>
                    </div>
                    <span class="ml-2 text-xs text-gray-600">Use as headline</span>
                  </label>
                </label>
                <input
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  [(ngModel)]="personalDetails.desiredJobPosition"
                  (ngModelChange)="updatePersonalDetails()"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <!-- Email and Phone -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                [(ngModel)]="personalDetails.emailAddress"
                (ngModelChange)="updatePersonalDetails()"
                placeholder=""
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
              <input
                type="tel"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                [(ngModel)]="personalDetails.phoneNumber"
                (ngModelChange)="updatePersonalDetails()"
                placeholder=""
              />
            </div>
          </div>

          <!-- Address -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              [(ngModel)]="personalDetails.address"
              (ngModelChange)="updatePersonalDetails()"
              placeholder=""
            />
          </div>

          <!-- Post code and City -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Post code</label>
              <input
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                [(ngModel)]="personalDetails.postCode"
                (ngModelChange)="updatePersonalDetails()"
                placeholder=""
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                [(ngModel)]="personalDetails.city"
                (ngModelChange)="updatePersonalDetails()"
                placeholder=""
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Profile/Summary Section (Collapsible) -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div
          class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          (click)="toggleSectionCollapse('profile')"
        >
          <div class="flex items-center gap-3">
            <span class="text-gray-400">::</span>
            <h3 class="text-lg font-semibold">Profile</h3>
          </div>
          <svg
            class="w-5 h-5 transition-transform"
            [class.rotate-180]="!profileCollapsed"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </div>

        <div *ngIf="!profileCollapsed" class="p-4 pt-0">
          <label class="block text-sm font-medium text-gray-700 mb-1">Summary</label>
          <!-- Quill Editor -->
          <div #profileEditor class="quill-editor-wrapper"></div>

          <!-- AI Suggestions Button -->
          <div class="mt-2 flex justify-end">
            <button
              (click)="toggleProfileSuggestions()"
              [disabled]="loadingAI()"
              class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-all bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              [class.opacity-50]="loadingAI()"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>AI Suggestions</span>
            </button>
          </div>

          <!-- AI Suggestions Display -->
          <div
            *ngIf="aiSuggestionsVisible.profile && profile.suggestions && profile.suggestions.length > 0"
            class="mt-3 border-2 border-blue-400 rounded-xl bg-white"
          >
            <!-- Suggestions Header with Refresh Button -->
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200">
              <span class="text-sm font-medium text-gray-700">AI Suggestions</span>
              <button
                (click)="getSuggestionsForProfile()"
                [disabled]="loadingAI()"
                class="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                [class.opacity-50]="loadingAI()"
                title="Refresh suggestions"
              >
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            <!-- Suggestions List -->
            <div class="p-3 space-y-2">
              <div
                *ngFor="let suggestion of profile.suggestions.slice(0, 3)"
                class="flex items-start gap-3 border border-gray-300 rounded-full px-4 py-3 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm transition-all cursor-pointer"
                (click)="applyProfileSuggestion(suggestion)"
              >
                <span class="text-blue-600 text-xl font-light flex-shrink-0">+</span>
                <p class="text-sm text-gray-700 leading-relaxed flex-1">{{ suggestion }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Experience Section (Collapsible with Entries) -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div
          class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          (click)="toggleSection('experiences')"
        >
          <div class="flex items-center gap-3">
            <span class="text-gray-400">::</span>
            <h3 class="text-lg font-semibold">Employment</h3>
          </div>
          <svg
            class="w-5 h-5 transition-transform"
            [class.rotate-180]="!sectionsCollapsed.experiences"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </div>

        <div *ngIf="!sectionsCollapsed.experiences" class="p-4 pt-0 space-y-3">
          <div
            *ngFor="let exp of experiences; trackBy: trackById"
            class="border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            [attr.data-exp-id]="exp.id"
          >
            <!-- Entry Card (Collapsed) -->
            <div
              *ngIf="!exp.expanded"
              class="flex items-center justify-between p-4 cursor-pointer"
              (click)="toggleExpEntry(exp.id)"
            >
              <div class="flex items-center gap-3 flex-1">
                <span class="text-gray-400">::</span>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-900 truncate">{{ exp.position || 'Untitled Position' }}</div>
                  <div class="text-sm text-gray-500 truncate">{{ exp.employer && exp.employer !== 'N/A' ? exp.employer : 'Company name' }}</div>
                </div>
              </div>
              <button class="p-2 hover:bg-gray-100 rounded-full" (click)="$event.stopPropagation(); toggleExpEntry(exp.id)">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            <!-- Entry Form (Expanded) -->
            <div *ngIf="exp.expanded" class="p-4 space-y-3">
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold">Experience Details</h4>
                <button
                  (click)="toggleExpEntry(exp.id)"
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  Collapse
                </button>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  [(ngModel)]="exp.position"
                  (ngModelChange)="updateExp(exp.id)"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Employer</label>
                  <input
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    [(ngModel)]="exp.employer"
                    (ngModelChange)="updateExp(exp.id)"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    [(ngModel)]="exp.city"
                    (ngModelChange)="updateExp(exp.id)"
                    placeholder="City"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Start date</label>
                  <div class="flex gap-2">
                    <select
                      class="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm"
                      [(ngModel)]="exp.startMonth"
                      (ngModelChange)="updateExp(exp.id)"
                    >
                      <option value="">Month</option>
                      <option *ngFor="let month of months" [value]="month">{{ month }}</option>
                    </select>
                    <select
                      class="w-24 border border-gray-300 rounded-md px-2 py-2 text-sm"
                      [(ngModel)]="exp.startYear"
                      (ngModelChange)="updateExp(exp.id)"
                    >
                      <option value="">Year</option>
                      <option *ngFor="let year of years" [value]="year">{{ year }}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-end">
                    <label class="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="hidden"
                        [(ngModel)]="exp.isPresent"
                        (ngModelChange)="updateExp(exp.id)"
                      />
                      <div class="relative">
                        <div class="w-10 h-5 bg-gray-300 rounded-full transition-colors" [class.bg-blue-600]="exp.isPresent"></div>
                        <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform" [class.translate-x-5]="exp.isPresent"></div>
                      </div>
                      <span class="ml-2 text-xs text-gray-600">Present</span>
                    </label>
                  </label>
                  <div class="flex gap-2">
                    <select
                      class="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm"
                      [(ngModel)]="exp.endMonth"
                      [disabled]="exp.isPresent"
                      (ngModelChange)="updateExp(exp.id)"
                    >
                      <option value="">Month</option>
                      <option *ngFor="let month of months" [value]="month">{{ month }}</option>
                    </select>
                    <select
                      class="w-24 border border-gray-300 rounded-md px-2 py-2 text-sm"
                      [(ngModel)]="exp.endYear"
                      [disabled]="exp.isPresent"
                      (ngModelChange)="updateExp(exp.id)"
                    >
                      <option value="">Year</option>
                      <option *ngFor="let year of years" [value]="year">{{ year }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Description Label and AI Button Container -->
              <div class="relative">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>

                <!-- Quill Editor for Experience -->
                <div [id]="'exp-editor-' + exp.id" class="quill-editor-wrapper experience-editor-with-button"></div>

                <!-- AI Suggestions Button - Positioned absolutely -->
                <button
                  (click)="toggleExpSuggestions(exp.id)"
                  [disabled]="loadingAI()"
                  class="absolute top-8 right-0 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                  [class.opacity-50]="loadingAI()"
                  style="z-index: 10;"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>AI Suggestions</span>
                </button>
              </div>

              <!-- AI Suggestions Display -->
              <div
                *ngIf="aiSuggestionsVisible.experiences[exp.id] && exp.suggestions && exp.suggestions.length > 0"
                class="border-2 border-blue-400 rounded-xl bg-white"
              >
                <!-- Suggestions Header with Refresh Button -->
                <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                  <span class="text-sm font-medium text-gray-700">AI Suggestions</span>
                  <button
                    (click)="getSuggestionsForExperience(exp.id)"
                    [disabled]="loadingAI()"
                    class="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    [class.opacity-50]="loadingAI()"
                    title="Refresh suggestions"
                  >
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>

                <!-- Suggestions List -->
                <div class="p-3 space-y-2">
                  <div
                    *ngFor="let suggestion of exp.suggestions.slice(0, 3)"
                    class="flex items-start gap-3 border border-gray-300 rounded-full px-4 py-3 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm transition-all cursor-pointer"
                    (click)="applyExpSuggestion(exp.id, suggestion)"
                  >
                    <span class="text-blue-600 text-xl font-light flex-shrink-0">+</span>
                    <p class="text-sm text-gray-700 leading-relaxed flex-1">{{ suggestion }}</p>
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-2 mt-4 pt-4 border-t">
                <button
                  (click)="deleteExp(exp.id)"
                  class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
                <button
                  (click)="toggleExpEntry(exp.id)"
                  class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>

          <button
            (click)="addNewExperience()"
            class="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + Add Experience
          </button>
        </div>
      </div>

      <!-- Education Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div
          class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          (click)="toggleSection('educations')"
        >
          <div class="flex items-center gap-3">
            <span class="text-gray-400">::</span>
            <h3 class="text-lg font-semibold">Education</h3>
          </div>
          <svg
            class="w-5 h-5 transition-transform"
            [class.rotate-180]="!sectionsCollapsed.educations"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </div>

        <div *ngIf="!sectionsCollapsed.educations" class="p-4 pt-0 space-y-3">
          <div
            *ngFor="let edu of educations; trackBy: trackById"
            class="border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <!-- Collapsed View -->
            <div
              *ngIf="!edu.expanded"
              class="flex items-center justify-between p-4 cursor-pointer"
              (click)="toggleEduEntry(edu.id)"
            >
              <div class="flex items-center gap-3">
                <span class="text-gray-400">::</span>
                <div>
                  <div class="font-semibold text-gray-900">{{ edu.degree || 'Degree' }}</div>
                  <div class="text-sm text-gray-600">{{ edu.school || 'School' }}</div>
                </div>
              </div>
              <button class="p-2 hover:bg-gray-100 rounded-full" (click)="$event.stopPropagation(); toggleEduEntry(edu.id)">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            <!-- Expanded View -->
            <div *ngIf="edu.expanded" class="p-4 space-y-3">
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold">Education Details</h4>
                <button
                  (click)="toggleEduEntry(edu.id)"
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  Collapse
                </button>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Degree/Program</label>
                <input
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  [(ngModel)]="edu.degree"
                  (ngModelChange)="updateEdu(edu.id)"
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">School</label>
                  <input
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    [(ngModel)]="edu.school"
                    (ngModelChange)="updateEdu(edu.id)"
                    placeholder="School name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    [(ngModel)]="edu.city"
                    (ngModelChange)="updateEdu(edu.id)"
                    placeholder="City"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Start date</label>
                  <div class="flex gap-2">
                    <select
                      class="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm"
                      [(ngModel)]="edu.startMonth"
                      (ngModelChange)="updateEdu(edu.id)"
                    >
                      <option value="">Month</option>
                      <option *ngFor="let month of months" [value]="month">{{ month }}</option>
                    </select>
                    <select
                      class="w-24 border border-gray-300 rounded-md px-2 py-2 text-sm"
                      [(ngModel)]="edu.startYear"
                      (ngModelChange)="updateEdu(edu.id)"
                    >
                      <option value="">Year</option>
                      <option *ngFor="let year of years" [value]="year">{{ year }}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-end">
                    <label class="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="hidden"
                        [(ngModel)]="edu.isPresent"
                        (ngModelChange)="updateEdu(edu.id)"
                      />
                      <div class="relative">
                        <div class="w-10 h-5 bg-gray-300 rounded-full transition-colors" [class.bg-blue-600]="edu.isPresent"></div>
                        <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform" [class.translate-x-5]="edu.isPresent"></div>
                      </div>
                      <span class="ml-2 text-xs text-gray-600">Present</span>
                    </label>
                  </label>
                  <div class="flex gap-2">
                    <select
                      class="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm"
                      [(ngModel)]="edu.endMonth"
                      [disabled]="edu.isPresent"
                      (ngModelChange)="updateEdu(edu.id)"
                    >
                      <option value="">Month</option>
                      <option *ngFor="let month of months" [value]="month">{{ month }}</option>
                    </select>
                    <select
                      class="w-24 border border-gray-300 rounded-md px-2 py-2 text-sm"
                      [(ngModel)]="edu.endYear"
                      [disabled]="edu.isPresent"
                      (ngModelChange)="updateEdu(edu.id)"
                    >
                      <option value="">Year</option>
                      <option *ngFor="let year of years" [value]="year">{{ year }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <!-- Quill Editor for Education -->
                <div [id]="'edu-editor-' + edu.id" class="quill-editor-wrapper"></div>
              </div>

              <div class="flex justify-end gap-2 mt-4 pt-4 border-t">
                <button
                  (click)="deleteEdu(edu.id)"
                  class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
                <button
                  (click)="toggleEduEntry(edu.id)"
                  class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>

          <button
            (click)="addNewEducation()"
            class="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + Add Education
          </button>
        </div>
      </div>

      <!-- Skills Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div
          class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          (click)="toggleSection('skills')"
        >
          <div class="flex items-center gap-3">
            <span class="text-gray-400">::</span>
            <h3 class="text-lg font-semibold">Skills</h3>
          </div>
          <svg
            class="w-5 h-5 transition-transform"
            [class.rotate-180]="!sectionsCollapsed.skills"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </div>

        <div *ngIf="!sectionsCollapsed.skills" class="p-4 pt-0 space-y-2">
          <div
            *ngFor="let skill of skills; trackBy: trackById"
            class="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-gray-300"
          >
            <span class="text-gray-400">::</span>
            <input
              type="text"
              class="flex-1 border-0 bg-transparent text-sm focus:outline-none"
              [(ngModel)]="skill.skillName"
              (ngModelChange)="updateSkill(skill.id)"
              placeholder="Skill name"
            />
            <select
              class="border border-gray-300 rounded-md px-2 py-1 text-sm"
              [(ngModel)]="skill.skillLevel"
              (ngModelChange)="updateSkill(skill.id)"
            >
              <option value="">Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <button
              (click)="deleteSkill(skill.id)"
              class="p-1 hover:bg-red-50 rounded text-red-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <button
            (click)="addNewSkill()"
            class="w-full border-2 border-dashed border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + Add Skill
          </button>
        </div>
      </div>

      <!-- Languages Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div
          class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          (click)="toggleSection('languages')"
        >
          <div class="flex items-center gap-3">
            <span class="text-gray-400">::</span>
            <h3 class="text-lg font-semibold">Languages</h3>
          </div>
          <svg
            class="w-5 h-5 transition-transform"
            [class.rotate-180]="!sectionsCollapsed.languages"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </div>

        <div *ngIf="!sectionsCollapsed.languages" class="p-4 pt-0 space-y-2">
          <div
            *ngFor="let lang of languages; trackBy: trackById"
            class="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-gray-300"
          >
            <span class="text-gray-400">::</span>
            <input
              type="text"
              class="flex-1 border-0 bg-transparent text-sm focus:outline-none"
              [(ngModel)]="lang.languageName"
              (ngModelChange)="updateLanguage(lang.id)"
              placeholder="Language name"
            />
            <select
              class="border border-gray-300 rounded-md px-2 py-1 text-sm"
              [(ngModel)]="lang.languageLevel"
              (ngModelChange)="updateLanguage(lang.id)"
            >
              <option value="">Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Native">Native</option>
            </select>
            <button
              (click)="deleteLanguage(lang.id)"
              class="p-1 hover:bg-red-50 rounded text-red-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <button
            (click)="addNewLanguage()"
            class="w-full border-2 border-dashed border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + Add Language
          </button>
        </div>
      </div>

      <!-- Courses Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div
          class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          (click)="toggleSection('courses')"
        >
          <div class="flex items-center gap-3">
            <span class="text-gray-400">::</span>
            <h3 class="text-lg font-semibold">Courses</h3>
          </div>
          <svg
            class="w-5 h-5 transition-transform"
            [class.rotate-180]="!sectionsCollapsed.courses"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </div>

        <div *ngIf="!sectionsCollapsed.courses" class="p-4 pt-0 space-y-2">
          <div
            *ngFor="let course of courses; trackBy: trackById"
            class="p-3 border border-gray-200 rounded-lg hover:border-gray-300"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="text-gray-400">::</span>
              <input
                type="text"
                class="flex-1 border-0 bg-transparent font-medium text-sm focus:outline-none"
                [(ngModel)]="course.courseName"
                (ngModelChange)="updateCourse(course.id)"
                placeholder="Course name"
              />
              <button
                (click)="deleteCourse(course.id)"
                class="p-1 hover:bg-red-50 rounded text-red-600"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              class="w-full border-0 bg-transparent text-xs text-gray-600 focus:outline-none"
              [(ngModel)]="course.institution"
              (ngModelChange)="updateCourse(course.id)"
              placeholder="Institution (optional)"
            />
          </div>

          <button
            (click)="addNewCourse()"
            class="w-full border-2 border-dashed border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + Add Course
          </button>
        </div>
      </div>

      <!-- Certificates Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div
          class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          (click)="toggleSection('certificates')"
        >
          <div class="flex items-center gap-3">
            <span class="text-gray-400">::</span>
            <h3 class="text-lg font-semibold">Certificates</h3>
          </div>
          <svg
            class="w-5 h-5 transition-transform"
            [class.rotate-180]="!sectionsCollapsed.certificates"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </div>

        <div *ngIf="!sectionsCollapsed.certificates" class="p-4 pt-0 space-y-2">
          <div
            *ngFor="let cert of certificates; trackBy: trackById"
            class="p-3 border border-gray-200 rounded-lg hover:border-gray-300"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="text-gray-400">::</span>
              <input
                type="text"
                class="flex-1 border-0 bg-transparent font-medium text-sm focus:outline-none"
                [(ngModel)]="cert.certificateTitle"
                (ngModelChange)="updateCertificate(cert.id)"
                placeholder="Certificate title"
              />
              <button
                (click)="deleteCertificate(cert.id)"
                class="p-1 hover:bg-red-50 rounded text-red-600"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              class="w-full border-0 bg-transparent text-xs text-gray-600 focus:outline-none"
              [(ngModel)]="cert.issuer"
              (ngModelChange)="updateCertificate(cert.id)"
              placeholder="Issuer (optional)"
            />
          </div>

          <button
            (click)="addNewCertificate()"
            class="w-full border-2 border-dashed border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + Add Certificate
          </button>
        </div>
      </div>
    </div>
  `,
        styles: [`
    :host {
      display: block;
    }

    /* Quill Editor Styling */
    /* Ensure quill-editor-wrapper is a block container */
    .quill-editor-wrapper {
      display: block;
      width: 100%;
    }

    .quill-editor-wrapper :ng-deep .ql-toolbar {
      border: 1px solid #d1d5db;
      border-bottom: none;
      border-radius: 0.5rem 0.5rem 0 0;
      background: #f9fafb;
      padding: 0.5rem;
      display: block;
      width: 100%;
    }

    /* Add space for floating AI button */
    .experience-editor-with-button :ng-deep .ql-toolbar {
      padding-right: 190px;
    }

    .quill-editor-wrapper :ng-deep .ql-container {
      border: 1px solid #d1d5db;
      border-radius: 0 0 0.5rem 0.5rem;
      font-family: inherit;
      font-size: 0.875rem;
      min-height: 150px;
      display: block;
      width: 100%;
    }

    .quill-editor-wrapper :ng-deep .ql-editor {
      min-height: 150px;
      line-height: 1.6;
      padding: 0.75rem;
      display: block;
      width: 100%;
    }

    .quill-editor-wrapper :ng-deep .ql-editor.ql-blank::before {
      color: #9ca3af;
      font-style: normal;
    }

    /* Remove default paragraph margins to avoid excess spacing */
    .quill-editor-wrapper :ng-deep .ql-editor p {
      margin: 0;
      padding: 0;
    }

    .quill-editor-wrapper :ng-deep .ql-editor ul,
    .quill-editor-wrapper :ng-deep .ql-editor ol {
      margin: 0.25rem 0;
      padding-left: 1.5rem;
    }

    .quill-editor-wrapper :ng-deep .ql-editor li {
      margin: 0;
      padding: 0.125rem 0;
    }

    .quill-editor-wrapper :ng-deep .ql-editor a {
      color: #2563eb;
      text-decoration: underline;
    }

    /* Add spacing between consecutive paragraphs (but not line breaks) */
    .quill-editor-wrapper :ng-deep .ql-editor p + p {
      margin-top: 0.5rem;
    }
  `]
    })
], LeftEditorComponent);
export { LeftEditorComponent };
//# sourceMappingURL=left-editor.component.js.map