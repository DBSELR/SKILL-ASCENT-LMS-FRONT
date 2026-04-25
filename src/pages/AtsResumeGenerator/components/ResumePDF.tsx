import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ResumeData } from '../types';

// Register fonts if needed, e.g., standard fonts are available by default

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  modernPage: {
    padding: '1cm',
    fontFamily: 'Helvetica',
  },
  classicPage: {
    padding: '0.8in',
    fontFamily: 'Times-Roman',
  },
  minimalistPage: {
    padding: '1in 0.8in',
    fontFamily: 'Helvetica',
  },
  // Typography
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  classicHeaderName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  minimalistHeaderName: {
    fontSize: 28,
    textAlign: 'left',
    marginBottom: 8,
    fontWeight: 'light',
  },
  contactInfo: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 16,
    color: '#475569',
  },
  classicContactInfo: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 16,
    color: '#000000',
  },
  minimalistContactInfo: {
    fontSize: 10,
    textAlign: 'left',
    marginBottom: 24,
    color: '#64748b',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  minimalistContactRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 4,
    marginBottom: 8,
  },
  classicSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    marginBottom: 8,
    color: '#000000',
  },
  minimalistSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#94a3b8',
    width: '25%',
  },
  text: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#334155',
  },
  classicText: {
    fontSize: 10,
    lineHeight: 1.2,
    color: '#000000',
  },
  itemContainer: {
    marginBottom: 10,
  },
  minimalistItemContainer: {
    marginBottom: 16,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  flexRowBaseline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#0f172a',
  },
  classicBoldText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000000',
  },
  italicText: {
    fontStyle: 'italic',
    fontSize: 10,
    color: '#475569',
  },
  dateText: {
    fontSize: 10,
    color: '#64748b',
  },
  classicDateText: {
    fontSize: 10,
    color: '#000000',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
  },
  minimalistRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  minimalistContent: {
    width: '75%',
  },
});

interface ResumePDFProps {
  data: ResumeData;
}

const ResumePDF: React.FC<ResumePDFProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects, template } = data;

  const isClassic = template === 'classic';
  const isMinimalist = template === 'minimalist';
  const isModern = template === 'modern' || !template;

  const pageStyle = isClassic ? styles.classicPage : isMinimalist ? styles.minimalistPage : styles.modernPage;
  const headerNameStyle = isClassic ? styles.classicHeaderName : isMinimalist ? styles.minimalistHeaderName : styles.headerName;
  const contactInfoStyle = isClassic ? styles.classicContactInfo : isMinimalist ? styles.minimalistContactInfo : styles.contactInfo;
  const sectionTitleStyle = isClassic ? styles.classicSectionTitle : isMinimalist ? styles.minimalistSectionTitle : styles.sectionTitle;
  const textStyle = isClassic ? styles.classicText : styles.text;
  const boldTextStyle = isClassic ? styles.classicBoldText : styles.boldText;
  const dateTextStyle = isClassic ? styles.classicDateText : styles.dateText;
  const contactRowStyle = isMinimalist ? styles.minimalistContactRow : styles.contactRow;

  const renderBulletPoints = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    return lines.map((line, index) => (
      <View key={index} style={styles.bulletPoint}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>{line.replace(/^-/, '').trim()}</Text>
      </View>
    ));
  };

  const renderSectionTitle = (title: string) => {
    if (isMinimalist) {
      return <Text style={styles.minimalistSectionTitle}>{title}</Text>;
    }
    return <Text style={sectionTitleStyle}>{title}</Text>;
  };

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.website
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {/* Header */}
        <View style={{ marginBottom: isMinimalist ? 30 : 20 }}>
          <Text style={headerNameStyle}>{personalInfo.fullName || 'John Doe'}</Text>
          <View style={contactInfoStyle}>
            <View style={contactRowStyle}>
              {contactItems.map((item, index) => (
                <Text key={index}>
                  {item}{index < contactItems.length - 1 && !isMinimalist ? ' | ' : (isMinimalist ? '   ' : '')}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Summary */}
        {personalInfo.summary && (
          <View style={isMinimalist ? styles.minimalistRow : { marginBottom: 20 }}>
            {renderSectionTitle('Summary')}
            <View style={isMinimalist ? styles.minimalistContent : {}}>
              <Text style={textStyle}>{personalInfo.summary}</Text>
            </View>
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={isMinimalist ? styles.minimalistRow : { marginBottom: 20 }}>
            {renderSectionTitle('Experience')}
            <View style={isMinimalist ? styles.minimalistContent : {}}>
              {experience.map((exp) => (
                <View key={exp.id} style={isMinimalist ? styles.minimalistItemContainer : styles.itemContainer}>
                  <View style={styles.flexRowBaseline}>
                    <Text style={boldTextStyle}>{exp.position}</Text>
                    <Text style={dateTextStyle}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</Text>
                  </View>
                  <Text style={[textStyle, { marginBottom: 4, fontWeight: isClassic ? 'normal' : 'medium' }]}>
                    {exp.company}
                  </Text>
                  {renderBulletPoints(exp.description)}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={isMinimalist ? styles.minimalistRow : { marginBottom: 20 }}>
            {renderSectionTitle('Projects')}
            <View style={isMinimalist ? styles.minimalistContent : {}}>
              {projects.map((proj) => (
                <View key={proj.id} style={isMinimalist ? styles.minimalistItemContainer : styles.itemContainer}>
                  <View style={styles.flexRowBaseline}>
                    <Text style={boldTextStyle}>
                      {proj.name} {proj.link ? <Text style={{ fontSize: 9, fontWeight: 'normal', color: '#64748b' }}>({proj.link})</Text> : ''}
                    </Text>
                  </View>
                  {proj.technologies && (
                    <Text style={[styles.italicText, { marginBottom: 4 }]}>Technologies: {proj.technologies}</Text>
                  )}
                  {renderBulletPoints(proj.description)}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Skills */}
        {skills && (
          <View style={isMinimalist ? styles.minimalistRow : { marginBottom: 20 }}>
            {renderSectionTitle('Skills')}
            <View style={isMinimalist ? styles.minimalistContent : {}}>
              <Text style={textStyle}>{skills}</Text>
            </View>
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={isMinimalist ? styles.minimalistRow : { marginBottom: 20 }}>
            {renderSectionTitle('Education')}
            <View style={isMinimalist ? styles.minimalistContent : {}}>
              {education.map((edu) => (
                <View key={edu.id} style={isMinimalist ? styles.minimalistItemContainer : styles.itemContainer}>
                  <View style={styles.flexRowBaseline}>
                    <Text style={boldTextStyle}>{edu.institution}</Text>
                    <Text style={dateTextStyle}>{edu.graduationDate}</Text>
                  </View>
                  <View style={styles.flexRow}>
                    <Text style={textStyle}>{edu.degree} in {edu.field}</Text>
                    {edu.gpa && <Text style={textStyle}>GPA: {edu.gpa}</Text>}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumePDF;
