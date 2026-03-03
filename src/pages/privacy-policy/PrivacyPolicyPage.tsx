import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/shared/ui/container'
import { Card } from '@/shared/ui/card'
import { PolicyDocumentHeaderCard } from '@/shared/ui/policy-document-header-card'

type PrivacyPolicyPageProps = {
  onBack?: () => void
}

const PRIVACY_SECTIONS = [
  {
    id: 'privacy-1',
    title: '1. 개인정보처리방침의 목적',
    paragraphs: [
      'Tasteam(이하 "회사")은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.',
      '회사는 개인정보처리방침을 통해 이용자의 개인정보가 어떤 목적과 방식으로 수집·이용되는지, 어떤 보호조치를 취하고 있는지 안내합니다.',
    ],
  },
  {
    id: 'privacy-2',
    title: '2. 개인정보의 처리 목적',
    paragraphs: [
      '회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행합니다.',
    ],
    bullets: [
      '회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지, 고충처리 목적으로 개인정보를 처리합니다.',
      '서비스 제공: 맛집 정보 검색, 리뷰 작성·열람, 찜 기능, 그룹 서비스, 위치기반 서비스 제공, 맞춤형 콘텐츠 제공 목적으로 개인정보를 처리합니다.',
      '마케팅 및 광고 활용: 이벤트 정보 및 참여기회 제공, 서비스의 유효성 확인, 신규 서비스 개발 및 특화 목적으로 개인정보를 처리합니다.',
    ],
  },
  {
    id: 'privacy-3',
    title: '3. 개인정보의 처리 및 보유 기간',
    paragraphs: [
      '① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.',
      '② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.',
    ],
    bullets: [
      '회원 가입 및 관리: 회원 탈퇴 시까지. 다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지 보유합니다.',
      '- 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우: 해당 수사·조사 종료 시까지',
      '- 서비스 이용에 따른 채권·채무관계 잔존 시: 해당 채권·채무관계 정산 시까지',
    ],
  },
  {
    id: 'privacy-4',
    title: '4. 처리하는 개인정보의 항목',
    paragraphs: ['회사는 서비스 제공을 위해 필요한 최소한의 개인정보를 수집합니다.'],
  },
  {
    id: 'privacy-5',
    title: '5. 개인정보의 제3자 제공',
    paragraphs: [
      '① 회사는 정보주체의 개인정보를 제2조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.',
      '② 회사는 현재 이용자의 개인정보를 제3자에게 제공하고 있지 않습니다. 향후 제3자 제공이 필요한 경우, 별도의 동의를 받아 진행합니다.',
    ],
  },
  {
    id: 'privacy-6',
    title: '6. 개인정보 처리의 위탁',
    paragraphs: [
      '① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.',
    ],
    bullets: [
      '클라우드 서비스 제공: Amazon Web Services (AWS) - 서비스 인프라 운영',
      '소셜 로그인 서비스: 카카오 - 카카오 계정을 통한 회원 인증',
    ],
  },
  {
    id: 'privacy-7',
    title: '7. 정보주체와 법정대리인의 권리·의무 및 행사방법',
    paragraphs: [
      '① 정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.',
      '② 권리 행사는 회사에 대해 「개인정보 보호법」 시행령 제41조 제1항에 따라 서면, 전자우편 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.',
      '③ 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수도 있습니다. 이 경우 「개인정보 보호법」 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.',
      '④ 개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조 제4항, 제37조 제2항에 의하여 정보주체의 권리가 제한될 수 있습니다.',
      '⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.',
      '⑥ 회사는 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.',
    ],
  },
  {
    id: 'privacy-8',
    title: '8. 개인정보의 파기',
    paragraphs: [
      '① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.',
      '② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.',
      '③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.',
    ],
    bullets: [
      '파기절차: 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.',
      '파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.',
    ],
  },
  {
    id: 'privacy-9',
    title: '9. 개인정보의 안전성 확보조치',
    paragraphs: ['회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.'],
    bullets: [
      '관리적 조치: 내부관리계획 수립·시행, 개인정보 취급 직원의 최소화 및 교육',
      '기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치',
      '물리적 조치: 전산실, 자료보관실 등의 접근통제',
    ],
  },
  {
    id: 'privacy-10',
    title: '10. 자동 수집 장치의 설치·운영 및 거부',
    paragraphs: [
      '① 회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 "쿠키(cookie)"를 사용합니다.',
      '② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자 PC 컴퓨터 내의 하드디스크에 저장되기도 합니다.',
    ],
    bullets: [
      '쿠키의 사용 목적: 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.',
      '쿠키의 설치·운영 및 거부: 웹브라우저 상단의 도구 > 인터넷 옵션 > 개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.',
      '쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.',
    ],
  },
  {
    id: 'privacy-11',
    title: '11. 행태정보의 수집·이용·제공 및 거부 등',
    paragraphs: [
      '① 회사는 서비스 이용과정에서 정보주체에게 최적화된 맞춤형 서비스 및 혜택, 온라인 맞춤형 광고 등을 제공하기 위하여 행태정보를 수집·이용하고 있습니다.',
      '② 회사는 다음과 같이 행태정보를 수집합니다.',
    ],
    bullets: [
      '수집하는 행태정보 항목: 이용자의 서비스 방문 이력, 검색 이력, 찜한 맛집 정보, 작성한 리뷰 정보',
      '행태정보 수집 방법: 이용자가 서비스를 이용할 때 자동 수집',
      '행태정보 수집 목적: 이용자의 관심, 성향에 기반한 개인 맞춤형 맛집 추천 서비스 제공',
      '보유·이용기간 및 이후 정보처리 방법: 회원 탈퇴 시까지 보유·이용. 탈퇴 시 지체 없이 파기',
    ],
  },
  {
    id: 'privacy-12',
    title: '12. 개인정보 보호책임자',
    paragraphs: [
      '① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.',
    ],
  },
  {
    id: 'privacy-13',
    title: '13. 개인정보 열람청구',
    paragraphs: [
      '정보주체는 「개인정보 보호법」 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. 회사는 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.',
    ],
    bullets: [
      '개인정보 열람청구 접수·처리 부서: 개인정보보호 담당팀',
      '이메일: privacy@tasteam.kr',
    ],
  },
  {
    id: 'privacy-14',
    title: '14. 권익침해 구제방법',
    paragraphs: [
      '정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.',
    ],
    bullets: [
      '개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)',
      '개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)',
      '대검찰청: (국번없이) 1301 (www.spo.go.kr)',
      '경찰청: (국번없이) 182 (ecrm.cyber.go.kr)',
    ],
  },
  {
    id: 'privacy-15',
    title: '15. 개인정보처리방침 변경',
    paragraphs: [
      '① 이 개인정보처리방침은 2026년 2월 23일부터 적용됩니다.',
      '② 이전의 개인정보처리방침은 아래에서 확인하실 수 있습니다.',
      '- 2026.02.23 ~ 현재 적용 (현재 버전)',
    ],
  },
] as const

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  return (
    <div className="min-h-screen bg-background pb-6">
      <TopAppBar title="개인정보처리방침" showBackButton onBack={onBack} />

      <Container className="space-y-4 pt-4">
        <PolicyDocumentHeaderCard
          eyebrow="Privacy Policy"
          title="Tasteam 개인정보처리방침"
          description="이용자의 개인정보를 어떤 항목으로 수집하고, 어떤 목적으로 이용·보관·보호하는지 안내합니다."
          effectiveDate="2026.02.23"
          updatedDate="2026.02.23"
        />

        <Card className="p-5">
          <h2 className="mb-3 text-base font-semibold">목차</h2>
          <nav aria-label="개인정보처리방침 목차">
            <ol className="space-y-2 text-sm">
              {PRIVACY_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </Card>

        <div className="space-y-3">
          {PRIVACY_SECTIONS.map((section) => (
            <Card key={section.id} id={section.id} className="scroll-mt-20 p-5">
              <section className="space-y-3">
                <h2 className="text-base font-semibold">{section.title}</h2>
                <div className="space-y-2">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-sm leading-6 text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {'bullets' in section && section.bullets ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}

                {section.id === 'privacy-3' ? (
                  <div className="space-y-2 rounded-lg border bg-muted/20 p-4">
                    <p className="text-sm font-medium">관련 법령에 따른 보관 기간</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
                      <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
                      <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
                      <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
                      <li>표시·광고에 관한 기록: 6개월 (전자상거래법)</li>
                      <li>서비스 방문 기록(로그기록, 접속지 추적자료): 3개월 (통신비밀보호법)</li>
                    </ul>
                  </div>
                ) : null}

                {section.id === 'privacy-4' ? (
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 font-medium">구분</th>
                          <th className="px-4 py-3 font-medium">수집 항목</th>
                          <th className="px-4 py-3 font-medium">수집 방법</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="px-4 py-3 text-muted-foreground">필수</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            카카오 계정 식별자(회원번호), 닉네임, 프로필 이미지
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            카카오 소셜 로그인 시 자동 수집
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-muted-foreground">선택</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            프로필 이미지 변경, 자기소개, 선호 음식 카테고리
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            프로필 설정 시 이용자 입력
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-muted-foreground">자동 생성</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            서비스 이용기록, 접속 로그, 접속 IP, 쿠키, 기기 정보(OS, 브라우저 종류)
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            서비스 이용 과정에서 자동 수집
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : null}

                {section.id === 'privacy-6' ? (
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 font-medium">수탁업체</th>
                          <th className="px-4 py-3 font-medium">위탁 업무 내용</th>
                          <th className="px-4 py-3 font-medium">보유 및 이용기간</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="px-4 py-3 text-muted-foreground">Amazon Web Services</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            클라우드 서버 운영 및 데이터 저장
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            회원 탈퇴 시 또는 위탁계약 종료 시
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-muted-foreground">카카오</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            소셜 로그인 서비스 제공
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            회원 탈퇴 시 또는 위탁계약 종료 시
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : null}

                {section.id === 'privacy-12' ? (
                  <div className="rounded-lg border bg-muted/20 p-4">
                    <dl className="grid gap-2 text-sm sm:grid-cols-[140px_1fr]">
                      <dt className="text-muted-foreground">성명</dt>
                      <dd>개인정보 보호책임자</dd>
                      <dt className="text-muted-foreground">직책</dt>
                      <dd>개인정보보호 담당</dd>
                      <dt className="text-muted-foreground">이메일</dt>
                      <dd>privacy@tasteam.kr</dd>
                      <dt className="text-muted-foreground">운영 시간</dt>
                      <dd>평일 10:00 - 18:00 (주말/공휴일 제외)</dd>
                    </dl>
                  </div>
                ) : null}
              </section>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  )
}
