import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#0A0D14',
    color: '#E5E7EB',
  },
  header: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #374151',
    paddingBottom: 15,
  },
  brand: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    letterSpacing: 2,
  },
  reportType: {
    fontSize: 10,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metaSection: {
    marginBottom: 30,
  },
  metaText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  scoreCard: {
    backgroundColor: '#151A26',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    border: '1px solid #374151',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 15,
    letterSpacing: 1,
  },
  scoreGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreItem: {
    alignItems: 'center',
    flex: 1,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  compositeValue: {
    color: '#10B981',
    fontSize: 28,
  },
  insightsGrid: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 30,
  },
  insightCol: {
    flex: 1,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingRight: 10,
  },
  bullet: {
    width: 10,
    fontSize: 14,
    color: '#10B981',
    marginRight: 6,
  },
  bulletText: {
    fontSize: 10,
    color: '#D1D5DB',
    lineHeight: 1.5,
  },
  analysisSection: {
    marginTop: 10,
  },
  questionCard: {
    backgroundColor: '#151A26',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeft: '3px solid #10B981',
  },
  questionHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 1.4,
  },
  label: {
    fontSize: 8,
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 4,
    marginTop: 8,
    fontWeight: 'bold',
  },
  userResponse: {
    fontSize: 9,
    color: '#9CA3AF',
    fontStyle: 'italic',
    lineHeight: 1.4,
    paddingLeft: 8,
    borderLeft: '1px solid #374151',
  },
  aiAdvice: {
    fontSize: 9,
    color: '#10B981',
    lineHeight: 1.5,
  }
});

export const InterviewReportPDF = ({ session, questions, jobRole, companyName, round, date }: any) => {
  const feedback = session.feedback || {};
  const techScore = feedback.domain_knowledge_score || 0;
  const artScore = feedback.articulation_score || 0;
  const commScore = feedback.communication_score || 0;
  const compScore = Math.round((techScore + artScore + commScore) / 3) || 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>ELEVATE</Text>
          <Text style={styles.reportType}>Performance Insights Report</Text>
        </View>

        <View style={styles.metaSection}>
          <Text style={styles.roleText}>{jobRole} {companyName ? `@ ${companyName}` : ''}</Text>
          <Text style={styles.metaText}>Round: {round}</Text>
          <Text style={styles.metaText}>Conducted on: {date}</Text>
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.sectionTitle}>Analytical Overview</Text>
          <View style={styles.scoreGrid}>
            <View style={styles.scoreItem}>
              <Text style={[styles.scoreValue, styles.compositeValue]}>{compScore}%</Text>
              <Text style={styles.scoreLabel}>Composite Score</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{techScore}%</Text>
              <Text style={styles.scoreLabel}>Domain Knowledge</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{artScore}%</Text>
              <Text style={styles.scoreLabel}>Articulation</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{commScore}%</Text>
              <Text style={styles.scoreLabel}>Communication</Text>
            </View>
          </View>
        </View>

        <View style={styles.insightsGrid}>
          <View style={styles.insightCol}>
            <Text style={styles.sectionTitle}>Core Strengths</Text>
            {feedback.what_went_well?.map((item: string, i: number) => (
              <View key={i} style={styles.bulletItem}>
                <Text style={styles.bullet}>✓</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={styles.insightCol}>
            <Text style={styles.sectionTitle}>Growth Areas</Text>
            {feedback.what_could_be_better?.map((item: string, i: number) => (
              <View key={i} style={styles.bulletItem}>
                <Text style={[styles.bullet, { color: '#EF4444' }]}>!</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.analysisSection}>
          <Text style={styles.sectionTitle}>Question-by-Question Analysis</Text>
          {questions.map((q: any, i: number) => (
            <View key={q.id} style={styles.questionCard} wrap={false}>
              <Text style={styles.questionHeader}>{i + 1}. {q.question_text}</Text>
              
              <Text style={styles.label}>Your Answer</Text>
              <Text style={styles.userResponse}>"{q.user_answer || 'No response recorded'}"</Text>
              
              <Text style={styles.label}>AI Feedback & Recommendation</Text>
              <Text style={styles.aiAdvice}>{feedback.recommended_responses?.[q.id] || 'No specific recommendation provided.'}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
